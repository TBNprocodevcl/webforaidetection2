from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.say_hello),
    path("",views.trangchu),
    path("trangchu/",views.trangchu),
    # path("get_waveform_image/",views.get_waveform_image),
    path("get_waveform_image/",views.get_predict),
    path("down_audio/",views.downaudio),
    path("get_result/",views.get_predict2),
]