#!/bin/sh

watch "node_modules/coffee-script/bin/coffee -c -o chess/static/js/application chess/static/coffee/ && node_modules/less/bin/lessc chess/static/less/all.less > chess/static/css/all.css"
