# Bot-or-Not
An anonymous chat room web app built with NodeJS, ExpressJS and SocketIO.
To be hosted on AWS where it will use a MongoDB cluster to store conversation data. 

## Setup Guide
Make sure you have meteor installed. Then run these commands in `botornot/`
### Production
```
meteor npm install
meteor # start meteor 
```
### Development
You'll probably want to add a settings file for local development. 

Then you'll wanna run 
```
meteor --settings settings.json
```
## Settings
_Sample settings file_
```
{ 
        "SeedDatabase" : true,
            "Debug" : true
}
```
Make sure that you export HOSTNAME
**ON MAC**
```export HOSTNAME=$(hostname)```
**ON LINUX**
```export HOSTNAME=$(HOSTNAME)```

