#/bin/bash

SCRIPT_PATH=${0%/*}
if [ "$0" != "$SCRIPT_PATH" ] && [ "$SCRIPT_PATH" != "" ]; then 
    cd $SCRIPT_PATH
fi
cd ../..

docker build -f etc/docker/Dockerfile -t doxxedbycelsius/front:latest .
