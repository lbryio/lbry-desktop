"""Set the package version to the output of `git describe`"""

from __future__ import print_function

import os.path
import sys
import fileinput


def main():
    filename = os.path.abspath(
        os.path.join(os.path.abspath(__file__), '..', '..', 'ui', 'js', 'lbryio.js'))
    for line in fileinput.input(filename, inplace=True):
        if line.startswith('  enabled: false'):
            print('  enabled: true')
        else:
            print(line, end='')


if __name__ == '__main__':
    sys.exit(main())
