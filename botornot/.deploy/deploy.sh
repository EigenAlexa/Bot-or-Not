cat hosts | while read a;

do
echo $a;
sed "s/HOST_IP/$a/g" mup.main.js > mup-$a.js
mup --config mup-$a.js $1

done
