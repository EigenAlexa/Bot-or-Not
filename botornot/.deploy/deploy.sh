export count=0;
  cat ports | while read port;
    do
    echo $port;
    sed "s/HOST_PORT/$port/g" mup.main.js > mup-$port.js;
    sed "s/HOST_ID/$count/g" settings.main.json > settings-$port.json;
    mup --config mup-$port.js --settings settings-$port.json $1 ;
    count=$((count + 1));
  done
