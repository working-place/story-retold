#!/bin/bash

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Production Deployment started "

git reset --hard
git pull origin master
echo "New changes pulled to server !"

echo "Installing Dependencies "
npm install --yes

echo "Creating Production Build "
npm run build

echo "Deployment Finished!"
