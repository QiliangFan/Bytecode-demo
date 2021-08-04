from django.db.models.aggregates import Sum
from backend.network.main.models import SFlow
from django.http import HttpResponse, HttpRequest
from django.http.response import JsonResponse
from django.db.models import F, Q
from django.shortcuts import render
from django.core.cache import cache

# Create your views here.

def test(request: HttpRequest):
    return JsonResponse({
        "msg": "hello"
    })

def get_dc_topo(request: HttpRequest):
    inner_res = SFlow.objects.filter(Q(src_dc = F('dst_dc'))).values("src_dc").annotate(Sum("bytes"))

    cross_res = SFlow.objects.filter(~Q(src_dc = F('dst_dc'))).values("src_psm", "src_dc", "dst_dc", "dir").annotate(Sum("bytes"))  # bytes__sum

    dc_map = {}
    nodes = []
    edges = []
    for i, inner_dict in enumerate(inner_res):
        nodes.append({
            "id": i+1,
            "value": inner_dict["bytes__sum"],
            "name": inner_dict["src_dt"],
            "label": inner_dict["src_dt"]
        })
        dc_map[["src_dt"]] = i + 1

    for i, cross_res in enumerate(cross_res):
        edges.append({
            "id": i+1,
            "from": dc_map[cross_res["src_dc"]],
            "to": dc_map[cross_res["dst_dc"]],
            "values":cross_res["bytes__sum"] * 8 / 10,
            "label": "10Gbps"
        })
    edges.sort(key=lambda item: item["from"], reverse=True)

    return JsonResponse({
        "data": {
            "nodes": nodes,
            "edges": edges
        }
    })
