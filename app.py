import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.env/lib/python2.7/site-packages'))

from flask import Flask, make_response
from flask.ext.mako import MakoTemplates
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.compress import Compress
from flask.ext.restful import Resource, Api
from flask.ext.assets import Environment

app = Flask(__name__)

mako = MakoTemplates(app)
db = SQLAlchemy(app)
Compress(app)
api = Api(app)
env = Environment(app)
