from django.db.models.query_utils import Q
from main.models import Link, SFlow, Subnet, Switch, Port
import pandas as pd
import os
from django.db.models import Model

from multiprocessing import Process

data_root = "/home/camp/data"
link_path = os.path.join(data_root, "link.csv")
inner_flow_path = os.path.join(data_root, "inner_sflow.csv")
cross_flow_path = os.path.join(data_root, "cross_datacenter_sflow.csv")
state_switch_path = os.path.join(data_root, "md_state_switch.csv")
port_path = os.path.join(data_root, "port.csv")
sub_net_path = os.path.join(data_root, "subnet.csv")

link = pd.read_csv(link_path)
inner_flow = pd.read_csv(inner_flow_path)
inner_flow = inner_flow[:int(len(inner_flow)//10)]
cross_flow = pd.read_csv(cross_flow_path)
cross_flow = cross_flow[:int(len(cross_flow))//10]
state_switch = pd.read_csv(state_switch_path)
port = pd.read_csv(port_path)
sub_net = pd.read_csv(sub_net_path)


def extract_port(port_id: int):
    port_dt = port[port["id"] == port_id]
    if len(port_dt) == 0:
        return None

    switch_id = int(port_dt["switch_id"].values[0])
    
    a_switch = state_switch[state_switch["id"] == switch_id]

    if len(a_switch) == 0:
        return None

    switch_obj = Switch(id=a_switch["id"].values[0], ip=a_switch["ip"].values[0], ip6=a_switch["ip6"].values[0], data_center=a_switch["name"].values[0][:11])
    switch_obj.save() 

    port_obj = Port(id=port_dt["id"].values[0], name=port_dt["name"].values[0], real_name=port_dt["real_name"].values[0], switch=switch_obj, speed=int(port_dt["speed"].values[0][:-1]), is_shutdown=port_dt["is_shutdown"].values[0])
    port_obj.save()

    return port_obj

def extract_sf(sf: pd.Series):
    src_ip = sf["srcIp"]
    dst_ip = sf["dstIp"]
    ip_type = sf["ipType"]
    sw_ip = sf["swIp"]
    sw_port = sf["swPort"]
    src_dc = sf["srcDC"]
    dst_dc = sf["dstDC"]
    src_psm = sf["srcPsm"]
    dst_psm = sf["dstPsm"]
    bytes = int(sf["bytes"]) / 1024 ** 3  # convert to GB
    dir = sf["dir"]

    try:
        switch_obj = Switch.objects.get(ip = sw_ip)
        port_obj = Port.objects.get(Q(switch_id = switch_obj.id) & Q(name = sw_port))
    except:
        return
    sflow_obj = SFlow(src_ip=src_ip,
                      dst_ip=dst_ip,
                      ip_type=ip_type,
                      sw_port=port_obj,
                      src_dc=src_dc,
                      dst_dc=dst_dc,
                      src_psm=src_psm,
                      dst_psm=dst_psm,
                      bytes=bytes,
                      dir=dir)
    return sflow_obj

def insert_subnet():
    i = 0
    subnet_list = []
    for _, (switch_id, ip, prefix, ip6, prefix6) in sub_net.iterrows():
        try:
            switch_obj = Switch.objects.get(id=switch_id)
        except:
            continue

        subnet = Subnet(switch=switch_obj, ip=ip, prefix=prefix, ip6=ip6, prefix6=prefix6)g
        subnet_list.append(subnet)
        i += 1
    Subnet.objects.bulk_create(subnet_list)
    print(f"insert subnet: {i}")


def insert_sflow():

    sf_list = []
    for index, sf in inner_flow.iterrows():
        res = extract_sf(sf)
        if res is not None:
            sf_list.append(res)

    for index, sf in cross_flow.iterrows():
        res = extract_sf(sf)
        if res is not None:
            sf_list.append(res)
    SFlow.objects.bulk_create(sf_list)

def insert_link():
    link_list = []
    for _, (_, a_port_id, z_port_id, _, _) in link.iterrows():
        a_port_obj = extract_port(a_port_id)
        if a_port_obj is None:
            continue
        z_port_obj = extract_port(z_port_id)
        if z_port_obj is None:
            continue
        link_obj = Link(src_port=a_port_obj, dst_port=z_port_obj, max_speed=max(a_port_obj.speed, z_port_obj.speed))
        link_list.append(link_obj)
    Link.objects.bulk_create(link_list)

def init():
    print("init........")

    insert_link()
    insert_subnet()
    insert_sflow()

    # link
    # p1 = Process(target=insert_link, args=())

    # # subnet
    # p2 = Process(target=insert_subnet, args=())

    # # sflow
    # p3 = Process(target=insert_sflow, args=())

    # p1.start()
    # p2.start()
    # p3.start()
    # p1.join()
    # p2.join()
    # p3.join()

