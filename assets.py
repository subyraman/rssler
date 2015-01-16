import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.env/lib/python2.7/site-packages'))
from flask.ext import assets
from config import FinalConfig
from app import env
import glob2 as glob

env.auto_build = FinalConfig.ASSETS_DEBUG
env.manifest = 'cache' if FinalConfig.ASSETS_DEBUG else 'file'

# Tell flask-assets where to look for our coffeescript and sass files.
env.load_path = [
    os.path.join(os.path.dirname(__file__), 'coffee'),
    os.path.join(os.path.dirname(__file__), 'bower_components'),
    os.path.join(os.path.dirname(__file__), 'sass'),
]

coffee_filters = ['coffeescript']
coffee_filters += ['rjsmin'] if not FinalConfig.ASSETS_DEBUG else []
coffee = assets.Bundle(
    '**/app.coffee',
    [f for f in glob.glob('**/*.coffee') if 'app' not in f],
    filters=coffee_filters,
    output="app.js")
env.register('coffee', coffee)

sass_filters = ['sass']
sass_filters += ['yui_css'] if not FinalConfig.ASSETS_DEBUG else []
sass = assets.Bundle('**/*.sass',
    filters=sass_filters,
    output="rssler.css")
env.register('sass', sass)

bootstrap_css = assets.Bundle(
    '**/bootstrap.css',
    '**/dist/select.css',
    filters='yui_css' if not FinalConfig.ASSETS_DEBUG else None,
    output="bootstrap.css")
env.register('bootstrap_css', bootstrap_css)

angular = assets.Bundle(
    '**/dist/jquery.js',
    '**/angular138.js',
    '**/angular-route.js',
    '**/angular-sanitize.js',
    '**/lodash.js',
    '**/ui-bootstrap-tpls.js',
    '**/dist/select.js',
    filters='rjsmin' if not FinalConfig.ASSETS_DEBUG else None,
    output='ng.js')
env.register('angular', angular)

def manual_build():
    angular.build()
    sass.build()
    coffee.build()
    bootstrap_css.build()

if __name__== "__main__":
    # If this file is called directly, do a manual build.
    manual_build()