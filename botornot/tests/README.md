First install `gagarin`. To do so run ``npm i -g gagarin``.
Then if you are running tests that use bots, run ```docker run -it -p 5000:5000
--name alice --net=host flask-alice``` in the flask-alice directory to start
the bots. Before you can do that you have to build the docker image, which you
can do with ```docker build -t flask-alice -f Dockerfile.botornot .``` After
each time you run the tests you have to restart the bots, I don't know how to
get around this. To do so just interupt the container and then run ``docker rm
alice`` then run the same run command again.

Run ```gagarin tests/gagarin --settings settings-local.json -T 20000 -t
100000``` in the botornot directory to run all the tests

You can use ``--verbose`` if something is failing to get a better idea of what
is going on.

You can use ``-g "filter"`` where filter is a grep style filter to run only
tests that match that filter

``-T`` and ``-t`` are timeout settings so if a test fails because of timeout
try increasing these.

Also, you can use ``-B`` to skip building the meteor app. The best way to use
this is run the meteor app with ``meteor --settings ...`` and then run gagarin
it will just use the build that the meteor app made. This way changes to the
code will be updated by the meteor app, and then you can rerun tests without
having to wait for the build.
