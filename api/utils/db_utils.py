from app import app
import os

def get_db_size():
    path = app.config['DB_PATH']
    return os.path.getsize(path)

def get_db():
    path = app.config['DB_PATH']
    return file(path, 'rb').read()