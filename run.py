import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.env/lib/python2.7/site-packages'))

import signal
import subprocess


if __name__ == "__main__":
    main = subprocess.Popen(['python', os.path.join(os.path.dirname(__file__), 'main_twisted.py')])
    async = subprocess.Popen(['python', os.path.join(os.path.dirname(__file__), 'daemon.py')])
    
    raw_input()

    print "Shutting down..."

    os.kill(main.pid, signal.SIGTERM)
    os.kill(async.pid, signal.SIGTERM)