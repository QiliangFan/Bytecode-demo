from django.db.models.aggregates import Sum
from main.models import SFlow, Link, Switch, Port
from django.http import HttpResponse, HttpRequest
from django.http.response import JsonResponse
from django.db.models import F, Q
from django.shortcuts import render
from django.core.cache import cache
from typing import cast
import json
from multiprocessing import Pool

# Create your views here.
def do_link(idx, link):
    fr = link.src_port.switch.id
    to = link.dst_port.switch.id
    return {
        'id': idx,
        'from': fr,
        "to": to,
        "max_speed": link.max_speed
    }, (fr, to)

def do_sw(sw):
    return {
        "id": sw.id,
        "value": 1,
        "name": sw.ip if sw.ip != "nan" else sw.ip6,
        "label": sw.ip if sw.ip != "nan" else sw.ip6,            
    }

def test(request: HttpRequest):
    return JsonResponse({
        "msg": "hello"
    })

def get_dc_topo(request: HttpRequest):
    # compute DC map
    if cache.get("dc_map") is not None:
        dc_map = cache.get("dc_map")
    else:
        dc_map = {}
        dc_list = Switch.objects.values("data_center")
        for i, dc in enumerate(list(dc_list)):
            if dc["data_center"] not in dc_map:
                dc_map[dc["data_center"]] = i+1
        dc_map["unknown"] = 0
        cache.set("dc_map", dc_map)

    if cache.get("inner_res") is not None:
        inner_res = cache.get("inner_res")
    else:
        inner_res = SFlow.objects.filter(Q(src_dc = F('dst_dc'))).values("src_dc").annotate(Sum("bytes"))
        cache.set("inner_res", inner_res, 600)
    
    if cache.get("cross_res") is not None:
        cross_res = cache.get("cross_res")
    else:
        cross_res = SFlow.objects.filter(~Q(src_dc = F('dst_dc'))).values("src_psm", "src_dc", "dst_dc", "dir").annotate(Sum("bytes"))  # bytes__sum
        cache.set("cross_res", cross_res, 600)

    if cache.get("cross_link") is not None:
        cross_link = cache.get("cross_link")
    else:
        cross_link = Link.objects.filter(~Q(src_port__switch__data_center = F('dst_port__switch__data_center')))
        cache.set("cross_link", cross_link, 600)

    nodes = []
    edges = []
    sflows = []

    # nodes
    if cache.get("nodes") is not None:
        nodes = cache.get("nodes")
    else:
        for i, inner_dict in enumerate(inner_res):
            if inner_dict["src_dc"] in dc_map:
                nodes.append({
                    "id": dc_map[inner_dict["src_dc"]],
                    "value": inner_dict["bytes__sum"],
                    "name": inner_dict["src_dc"],
                    "label": inner_dict["src_dc"]
                })
        cache.set("nodes", nodes, 600)

    # edges
    if cache.get("edges") is not None:
        edges = cache.get("edges")
    else:
        used = set()
        for i, link in enumerate(cross_link):
            link = cast(Link, link)
            fr = dc_map[link.src_port.switch.data_center]
            to = dc_map[link.dst_port.switch.data_center]
            if (fr, to) not in used:
                used.add((fr, to))
                edges.append({
                    "id": i+1,
                    "from": fr,
                    "to": to,
                    "max_speed": link.max_speed
                })
        cache.set("edges", edges, 600)

    # sflows
    if cache.get("sflows") is not None:
        sflows = cache.get("sflows")
    else:
        for i, cross_dict in enumerate(cross_res):
            if cross_dict["src_dc"] not in dc_map or cross_dict["dst_dc"] not in dc_map:
                continue
            src_dc = dc_map[cross_dict["src_dc"]]
            dst_dc = dc_map[cross_dict["dst_dc"]]
            psm = cross_dict["src_psm"]
            bytes = cross_dict["bytes__sum"]
            edge_id = -1
            for edge_dict in edges:
                fr = edge_dict["from"]
                to = edge_dict["to"]
                if fr == src_dc and to == dst_dc:
                    edge_id = edge_dict["id"]
            if edge_id > 0:
                sflows.append({
                    "id": i,
                    "edge_id": edge_id,
                    "psm": psm,
                    "GB": bytes,
                })
        sflows.sort(key=lambda map: map["edge_id"])
        cache.set("sflows", sflows, 600)

    return JsonResponse({
        "data": {
            "nodes": nodes,
            "edges": edges,
            "sflows": sflows
        }
    })


def get_dc_inner_topo(request: HttpRequest):
    if request.method == "OPTIONS":
        return JsonResponse({})

    pool = Pool(32)
    
    
    print(request.body)
    print(request)
    dc_name = json.loads(request.body)["name"]
    print(dc_name)

    nodes = []
    edges = []
    sflows = []

    # nodes
    if cache.get(f"inner_nodes_{dc_name}") is not None:
        nodes = cache.get(f"inner_nodes_{dc_name}")
    else:
        switch_list = Switch.objects.filter(Q(data_center=dc_name))
        print(switch_list.count())

        nodes = pool.starmap(do_sw, [[sw] for sw in switch_list])
        cache.set(f"inner_nodes_{dc_name}", nodes, 600)
    print("nodes...")

    # edges
    if cache.get(f"inner_edges_{dc_name}") is not None:
        edges = cache.get(f"inner_edges_{dc_name}")
    else:
        used = set()
        link_list = list(Link.objects.filter(Q(src_port__switch__data_center=dc_name) & Q(dst_port__switch__data_center=dc_name)))
        print(f"link count: {len(link_list)}")
        res_list = pool.starmap(do_link, [(i, link)  for i, link in enumerate(link_list)])
        for edge, tag in res_list:
            if tag not in used:
                used.add(tag)
                edges.append(edge)

        cache.set(f"inner_edges_{dc_name}", edges, 600)
    print("edegs...")

    # sflows
    if cache.get(f"inner_sflows_{dc_name}") is not None:
        sflows = cache.get(f"inner_sflows_{dc_name}")
    else:
        sflow_list = SFlow.objects.filter(Q(src_dc=dc_name) & Q(dst_dc=dc_name)).values("src_psm", "dir", "sw_port").annotate(Sum("bytes"))
        
        for i, sflow in enumerate(sflow_list):
            try:
                if sflow["dir"] == 1:
                    src_port_id = sflow["sw_port"]
                    src_port = Port.objects.get(id=src_port_id)
                    dst_port = Link.objects.get(src_port__id=src_port_id).dst_port
                    src_sw = src_port.switch.id
                    dst_sw = dst_port.switch.id

                else:  # 流入
                    dst_port_id = sflow["sw_port"]
                    dst_port = Port.objects.get(id=dst_port_id)
                    src_port = Link.objects.get(dst_port__id=dst_port_id).src_port
                    src_sw = src_port.switch.id
                    dst_sw = dst_port.switch.id
                
                edge_id = -1
                for edge in edges:
                    if edge["from"] == src_sw and edge["to"] == dst_sw:
                        edge_id = edge["id"]
                if edge_id > -1:
                    sflows.append({
                        "id": i,
                        "psm": sflow["src_psm"],
                        "GB": sflow["bytes__sum"],
                        "edge_id": edge_id
                    })
            except:
                continue
        cache.set(f"inner_sflows_{dc_name}", sflows, 600)
    if cache.get(f"inner_sflows_filter_{dc_name}") is not None:
        sflows = cache.get(f"inner_sflows_filter_{dc_name}")
        edges = cache.get(f"inner_edges_filter_{dc_name}")
        nodes = cache.get(f"inner_nodes_filter_{dc_name}")
    else:
        sflows.sort(key=lambda a: a["GB"], reverse=True)
        sflows = sflows[:2000]
        edges = [edge for edge in edges if any([edge["id"] == d["edge_id"] for d in sflows])]
        nodes = [node for node in nodes if any([any([node["id"] == d["from"], node["id"] == d["to"]]) for d in edges])]
        cache.set(f"inner_sflows_filter_{dc_name}", sflows, 600)
        cache.set(f"inner_edges_filter_{dc_name}", edges, 600)
        cache.set(f"inner_nodes_filter_{dc_name}", nodes, 600)

    return JsonResponse({
        "data": {
            "nodes": nodes,
            "edges": edges,
            "sflows": sflows
        }
    })