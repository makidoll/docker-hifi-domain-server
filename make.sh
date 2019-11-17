#!/bin/bash
DIR=$(pwd)
cd $DIR/hifi/build
HIFI_VCPKG_BASE=$DIR/vcpkg make domain-server -j6
