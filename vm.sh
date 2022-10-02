#!/bin/bash

sudo apt-get remove -y --purge man-db
sudo apt install -y git-all screen nodejs
sudo apt-get install -y npm
sudo systemctl stop apache2
sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
sudo service iptables save
git clone https://github.com/dcep93/proxy420
cd proxy420/app
screen
git reset --hard HEAD && \
    git pull && \
    npm install && \
    printf "<pre>%s\n%s\n</pre>\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > recorded_sha.txt && \
    sudo PORT=80 node server.js
