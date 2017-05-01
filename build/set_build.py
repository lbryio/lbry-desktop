"""Set the build version to be 'dev', 'qa', 'rc', 'release'"""

from __future__ import print_function

import os.path
import re
import subprocess
import sys
import fileinput


def main():
    build = get_build()
    with open(os.path.join('lbry', 'lbrynet', 'build_type.py'), 'w') as f:
        f.write('BUILD = "{}"'.format(build))
    set_early_access()


def set_early_access():
    filename = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', '..', 'ui', 'js', 'lbryio.js'))
    for line in fileinput.input(filename, inplace=True):
        if line.startswith('  enabled: false'):
            print('  enabled: true')
        else:
            print(line, end='')


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
