from main.models import Port,Link,Topo
from django.db.models import Q

def get_topo():
    link_data = Link.objects.all()
    for link in link_data:
        a_port = Port.objects.get(Q(id=link.srcport))
        b_port = Port.objects.get(Q(id=link.dstport))
        max_speed = max(a_port.speed,b_port.speed)
        a_topo = Topo.objects.get(Q(src_switch=a_port.switch_id),Q(dst_switch=b_port.switch_id))
        b_topo = Topo.objects.get(Q(src_switch=b_port.switch_id),Q(dst_switch=a_port.switch_id))
        if a_topo:
            a_topo.capacity = a_topo.capacity + max_speed
            b_topo.capacity = a_topo.capacity
        else:
            a_topo = Topo(src_switch = a_port.switch_id,dst_switch = b_port.switch_id,capacity = max_speed)
            b_topo = Topo(src_switch = b_port.switch_id,dst_switch = a_port.switch_id,capacity = max_speed)
        a_topo.save()
        b_topo.save()
        



