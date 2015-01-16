from flask import Flask, make_response
from flask.ext.mako import MakoTemplates
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.compress import Compress
from flask.ext.restful import Resource, Api
from flask.ext.assets import Environment
import os

current_dir = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)

mako = MakoTemplates(app)
db = SQLAlchemy(app)
Compress(app)
api = Api(app)
env = Environment(app)
