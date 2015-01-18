import os

DEBUG = True
current_dir = os.path.dirname(os.path.realpath(__file__))

class BaseConfig(object):
    DEBUG = DEBUG
    HOST = '0.0.0.0'
    PORT = 5000
    ASSETS_DEBUG = False
    DB_PATH = os.path.join(current_dir, 'rss.db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % DB_PATH
    COMPRESS_DEBUG = True
    SASS_DEBUG_INFO = False

class DevConfig(BaseConfig):
    HOST = '127.0.0.1'
    ASSETS_DEBUG = True
    SASS_DEBUG_INFO = True


FinalConfig = DevConfig if DEBUG else BaseConfig