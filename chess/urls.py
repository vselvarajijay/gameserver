from django.conf.urls import patterns, url

urlpatterns = patterns('chess.views',
        url(r'^chess/index/$','index', name='index'),)
