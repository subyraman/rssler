from app import app
from flask.ext.mako import render_template

@app.route("/",)
def index(path=None):
    return render_template('index.html', name='mako')