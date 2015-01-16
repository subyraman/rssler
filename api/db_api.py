from flask import make_response
from flask.ext.restful import Resource
from app import app, api
from utils import db_utils


@app.route('/db')
def get_db():
    db = db_utils.get_db()

    response = make_response(db)
    response.headers["Content-Disposition"] = "attachment; filename=rss.db"
    return response

class DBSizeAPI(Resource):
    def get(self):
        size = db_utils.get_db_size()
        return {'size': size}

api.add_resource(DBSizeAPI, '/db/size')