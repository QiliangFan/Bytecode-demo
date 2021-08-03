"""
Database CRUD
"""
from main.models import Port, Link
from django.db.models import Q

class CRUD:

    def __init__(self):
        pass


    def get_link_port(self, port: Port):
        links = Link.objects.filter(Q(src_port__id = port.id) | Q(dst_port_id = port.id))
        ports = [link.src_port if link.src_port.id != port.id else link.dst_port for link in links ]
        return ports