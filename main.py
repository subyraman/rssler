import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.env/lib/python2.7/site-packages'))

from twisted.internet import reactor
from twisted.web.server import Site
from twisted.web.wsgi import WSGIResource

from app import app
from app import db
from models import *
from views import *
from api import *
import config


def run_app():
    app = get_app()
    host = app.config['HOST']
    port = app.config['PORT']
    app.run(host=host, port=port)

def get_app():
    app.config.from_object('config.FinalConfig')
    db.create_all()

    return app

app = get_app()

if __name__ == "__main__":
    if not app.config['DEBUG']:
        resource = WSGIResource(reactor, reactor.getThreadPool(), app)
        site = Site(resource)
        host = app.config['HOST']
        port = app.config['PORT']
        print 'Running server on %s:%s' % (host, port)
        print 'Press any key to exit'
        
        reactor.listenTCP(app.config['PORT'], site, interface=app.config['HOST'])
        reactor.run()
        
    else:
        run_app()


