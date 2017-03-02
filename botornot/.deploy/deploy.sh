export count=0;
cat hosts | while read a;
do
echo $a;
sed "s/HOST_IP/$a/g" mup.main.js > mup-$a.js;
sed "s/HOST_ID/$count/g" settings.main.json > settings-$a.json;
mup --config mup-$a.js --settings settings-$a.json $1 ;
count=$((count + 1));
done
