"""
Database CRUD
"""
from typing import List
from main.models import Port, Link, Subnet, Switch, SFlow

from django.db.models import Q, F
import ipaddress

def get_link_ports(port: Port) -> List[Port]:
    links = Link.objects.filter(Q(src_port__id = port.id) | Q(dst_port_id = port.id))
    ports = [link.src_port if link.src_port.id != port.id else link.dst_port for link in links ]
    return ports

def get_link(port: Port) -> Link:
    links = port.src_port_link | port.dst_port_link 
    if links.count() > 1:
        raise ValueError()
    link = links.first()
    return link

def get_tor(ip: str) -> Switch:
    """
    get TOR switch
    """
    if "." in ip:  # ipv4
        ip = ".".join(ip.split(".")[:2])
    elif ":" in ip:
        ip = ":".join(ip.split(":")[:3])
    else:
        raise ValueError()

    subnets = Subnet.objects.filter(Q(ip__startswith = ip) | Q(ip6__starswith = ip))
    if subnets.count() > 1:
        raise ValueError()
    subnet = subnets.first()
    return subnet

def get_sflows(port: Port, dir: int = None) -> List[SFlow]:
    """
    0：流入
    1: 
    """
    if dir is None:
        sflows = port.port_sflow.all()
    elif dir == 0 or dir == 1:
        sflows = port.port_sflow.filter(dir = dir)
    else:
        raise ValueError()
    sflows = list(sflows)
    return sflows

def get_cross_sflow(port: Port, dir: int = None) -> List[SFlow]:
    if dir is None:
        sflows = port.port_sflow.all()
    elif dir == 0 or dir == 1:
        sflows = port.port_sflow.filter(dir = dir)
    else:
        raise ValueError()
    sflows = list(sflows.filter(~Q(src_dc=F("dst_dc"))))
    return sflows

def get_inner_sflow(port: Port, dir: int = None) -> List[SFlow]:
    if dir is None:
        sflows = port.port_sflow.all()
    elif dir == 0 or dir == 1:
        sflows = port.port_sflow.filter(dir = dir)
    else:
        raise ValueError()
    sflows = list(sflows.filter(~Q(src_dc=F("dst_dc"))))
    return sflows

def get_alL_cross_sflow(dir: int = None) -> List[SFlow]:
    sflows = SFlow.filter(~Q(src_dc = F("dst_dc")))
    if dir is None:
        sflows = sflows.all()
    elif dir == 0 or dir == 1:
        sflows = sflows.filter(dir = dir)
    sflows = list(sflows)
    return sflows

