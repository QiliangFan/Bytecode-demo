from django.db import models
from django.db.models.fields import *
from django.db.models.fields.related import ForeignKey

# Create your models here.

class Subnet(models.Model):


    class Meta:
        db_table = "subnet"


class Switch(models.Model):
    #test
    ip = CharField(name="ip", max_length=30, null=False, db_index=True)
    ip6 = CharField(name="ipv6", max_length=30, null=True, db_index=True)   # not useful as ip
    data_center = CharField(name="data_center", max_length=30, null=False, db_index=True)

    class Meta:

        db_table = "switch"

class Port(models.Model):
    
    name = CharField(name="name", max_length=30, null=False)
    switch = ForeignKey(to=Switch, on_delete=models.CASCADE)
    max_speed = IntegerField(name="max_speed", null=False)

    class Meta:

        db_table = "port"


class Link(models.Model):
    src_port = ForeignKey(to=Port, on_delete=models.CASCADE)
    dst_port = ForeignKey(to=Port, on_delete=models.CASCADE)

    max_speed = IntegerField(name="max_speed", )

    class Meta:
        db_table = "link"