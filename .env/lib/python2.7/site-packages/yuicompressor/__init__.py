import sys
import os
import subprocess

__version__ = '2.4.8'


def get_jar_filename():
    """Return the full path to the YUI Compressor Java archive."""
    filename = "yuicompressor-%s.jar" % __version__
    this_dir = os.path.realpath(os.path.dirname(__file__))
    return os.path.join(this_dir, filename)


def run(*args):
    cmd_args = ["java", "-jar", get_jar_filename()] + list(args)
    return subprocess.call(cmd_args)


def main():
    exit_code = run(*sys.argv[1:])
    sys.exit(exit_code)
