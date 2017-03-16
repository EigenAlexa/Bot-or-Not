import json
import os
f = open('settings.json', 'r')
settings = json.load(f)
settings['hostPort'] = os.environ['PORT']
print(json.dumps(settings))
f.close()

