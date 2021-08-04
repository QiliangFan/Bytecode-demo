from django.urls import path, re_path
from main.views import test, get_dc_topo

urlpatterns = [
    re_path("/test", test),
    re_path("/get_dc_top", get_dc_topo)
]
