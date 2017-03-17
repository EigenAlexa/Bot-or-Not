export count=0;
  cat ports | while read port;
    do
    echo $port;
    export PORT=$port;
    sed "s/HOST_PORT/$port/g" mup.main.js > mup-$port.js;
    #python fix-settings.py > settings-$port.json ;
    mup2 --config mup-$port.js --settings settings.json $1 ;
    count=$((count + 1));
  done
