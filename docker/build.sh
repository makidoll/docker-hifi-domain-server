sudo rm -rf domain # docker testing volume

cp ../hifi/build/domain-server/domain-server .

docker build -t makitsune/hifi:0.86.0 .

rm -f domain-server