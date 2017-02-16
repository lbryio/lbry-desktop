"""Set the build version to be 'dev', 'qa', 'rc', 'release'"""

import json
import os.path
import re
import subprocess
import sys


def main():
    build = get_build()
    with open(os.path.join('lbry', 'lbrynet', 'build_type.py'), 'w') as f:
        f.write('BUILD = "{}"'.format(build))


def get_build():
    try:
        tag = subprocess.check_output(['git', 'describe', '--exact-match']).strip()
        if re.match('v\d+\.\d+\.\d+rc\d+', tag):
            return 'rc'
        else:
            return 'release'
    except subprocess.CalledProcessError:
        # if the build doesn't have a tag
        return 'qa'


if __name__ == '__main__':
    sys.exit(main())
