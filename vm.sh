#!/bin/bash

sudo apt install -y git-all screen nodejs
sudo apt-get install npm
git clone https://github.com/dcep93/proxy420
cd proxy420/app
npm install
screen
npm start
# git pull
