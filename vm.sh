#!/bin/bash

sudo apt install -y git-all screen nodejs
sudo apt-get install npm
git clone https://github.com/dcep93/proxy420
cd proxy420/app
screen
git reset --hard HEAD && git pull && npm install && printf "<pre>%s\n%s\n</pre>\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > recorded_sha.txt && PORT=8080 npm start
# git pull
