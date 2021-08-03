"""
Database CRUD
"""
from main.models import Port, Link, Subnet
from django.db.models import Q
import ipaddress

class CRUD:

    def __init__(self):
        pass


    def get_link_port(self, port: Port):
        links = Link.objects.filter(Q(src_port__id = port.id) | Q(dst_port_id = port.id))
        ports = [link.src_port if link.src_port.id != port.id else link.dst_port for link in links ]
        return ports

    def get_tor(self, ip: str):
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