from django.db import models
from django.db.models.enums import Choices
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
    
class SFlow(models.Model):

    src_ip = CharField(name='srcip',max_length=30,null=False)
    dst_ip = CharField(name='dstip',max_length=30,null=False)
    ip_type = CharField(name='ipType',max_length=30,null=False)
    sw_port = ForeignKey(to=Port,on_delete=models.CASCADE)
    src_dc = CharField(name='srcDc',max_length=30,null=False)
    dst_dc = CharField(name='dstDc',max_length=30,null=False)
    src_psm = CharField(name='srcPsm',max_length=30,null=False)
    dst_psm = CharField(name='dstPsm',max_length=30,null=False)
    bytes = IntegerField(name='bytes',null=False)
    
    class Dir(models.IntegerChoices):
        dir_1=1
        dir_0=0
    dir = IntegerField(name='dir',choices=Dir.choices)     
    class Meta:

        db_table = "sflow"