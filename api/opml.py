from flask import Flask, request, jsonify
from flask.ext.restful import Resource, Api
from app import api
from flask import make_response
from StringIO import StringIO
from utils import opml_import

class OpmlAPI(Resource):
    def get(self):
        pass

    def post(self):
        params = request.get_json()
        opml = params['opml']

        try:
            ret = opml_import.OPMLImporter(opml).run()
            return ret
        except Exception, e:
            print str(e)
            ret = {'type': 'danger', 'msg': 'Could not parse file as an OPML file.'}
            return ret, 422

api.add_resource(OpmlAPI, '/opml')