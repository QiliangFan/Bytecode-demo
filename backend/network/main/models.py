from django.db import models
from django.db.models.fields import *
from django.db.models.fields.related import ForeignKey

# Create your models here.

class Subnet(models.Model):


    class Meta:
        db_table = "subnet"


class Switch(models.Model):

    id = CharField(name='id',max_length=30,null=False,db_index=True,primary_key=True)
    ip = CharField(name="ip", max_length=30, null=False)
    ip6 = CharField(name="ipv6", max_length=30, null=True)   # not useful as ip
    data_center = CharField(name="data_center", max_length=30, null=False)


    class Meta:

        db_table = "switch"

class Port(models.Model):
    
    id = IntegerField(name="id",primary_key=True)
    name = CharField(name="name", max_length=30, null=False)
    real_name = CharField(name="real_name", max_length=30, null=False)
    switch_id = ForeignKey(to=Switch, on_delete=models.CASCADE)
    speed = IntegerField(name="speed", null=False)
    is_shutdown = IntegerField(name="is_shutdown", null=False)
    
    class Meta:

        db_table = "port"


class Link(models.Model):
    src_port = ForeignKey(to=Port, on_delete=models.CASCADE)
    dst_port = ForeignKey(to=Port, on_delete=models.CASCADE)

    max_speed = IntegerField(name="max_speed", null=False)

    class Meta:
        db_table = "link"

class Topo(models.Model):
    src_switch = IntegerField(name="src_switch",null=False)
    dst_switch = IntegerField(name="dst_switch",null=False)
    capacity = IntegerField(name="capacity",null=False)

    class Meta:
        db_table = "topo"
