"""
Database CRUD
"""
from typing import List
from main.models import Port, Link, Subnet, Switch, SFlow
from django.db.models import Q
import ipaddress

class CRUD:

    def __init__(self):
        pass


    def get_link_ports(self, port: Port) -> List[Port]:
        links = Link.objects.filter(Q(src_port__id = port.id) | Q(dst_port_id = port.id))
        ports = [link.src_port if link.src_port.id != port.id else link.dst_port for link in links ]
        return ports

    def get_link(self, port: Port) -> Link:
        links = port.src_port_link | port.dst_port_link 
        if links.count() > 1:
            raise ValueError()
        link = links.first()
        return link

    def get_tor(self, ip: str) -> Switch:
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

    def get_sflows(self, port: Port) -> List[SFlow]:
        sflows = SFlow.port_sflow.all()
        sflows = list(sflows)
        return sflows