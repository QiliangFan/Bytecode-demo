from django.urls import path, re_path
from main.views import get_dc_inner_topo, test, get_dc_topo

urlpatterns = [
    re_path("/test", test),
    re_path("/get_dc_topo$", get_dc_topo),
    re_path("/get_dc_inner_topo$", get_dc_inner_topo)
]
