from django.db import models
from django.db.models.fields import *
from django.db.models.fields.related import ForeignKey

# Create your models here.


class Switch(models.Model):

    id = CharField(max_length=30,null=False,db_index=False,primary_key=True)
    ip = CharField(max_length=30, null=False)
    ip6 = CharField(max_length=30, null=True, )   # not useful as ip
    data_center = CharField(max_length=30, null=False)



class Subnet(models.Model):
    switch = ForeignKey(to=Switch, on_delete=models.CASCADE, related_name="sw_subnet")
    ip = CharField(max_length=30)
    prefix = CharField(max_length=30)
    ip6 = CharField(max_length=30)
    prefix6 = CharField(max_length=30)



class Port(models.Model):
    
    id = IntegerField(primary_key=True, db_index=False)
    name = CharField(max_length=30, null=False)
    real_name = CharField(max_length=30, null=False)
    switch = ForeignKey(to=Switch, on_delete=models.CASCADE, related_name="sw_port")
    speed = IntegerField(null=False)
    is_shutdown = IntegerField(null=False)
    

class Link(models.Model):
    src_port = ForeignKey(to=Port, on_delete=models.CASCADE, related_name="src_port_link")
    dst_port = ForeignKey(to=Port, on_delete=models.CASCADE, related_name="dst_port_link")
    max_speed = FloatField(null=False)


class SFlow(models.Model):

    src_ip = CharField(max_length=30,null=False)
    dst_ip = CharField(max_length=30,null=False)
    ip_type = CharField(max_length=30,null=False)
    sw_port = ForeignKey(to=Port,on_delete=models.CASCADE, related_name="port_sflow")
    src_dc = CharField(max_length=30,null=False, db_index=False)
    dst_dc = CharField(max_length=30,null=False, db_index=False)
    src_psm = CharField(max_length=30,null=False)
    dst_psm = CharField(max_length=30,null=False)
    bytes = FloatField(null=False)
    
    class Dir(models.IntegerChoices):
        dir_1=1
        dir_0=0
    dir = IntegerField(choices=Dir.choices, db_index=False)     
