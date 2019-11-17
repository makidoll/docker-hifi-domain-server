sudo rm -rf domain # docker testing volume

#cp -r ../vcpkg/*/ ./vcpkg
rm -rf vcpkg/installed

#cp ../hifi/build/domain-server/domain-server .
#cp ../hifi/build/assignment-client/assignment-client .

docker build -t makitsune/hifi:0.85.0 .

#rm -f domain-server assignment-client