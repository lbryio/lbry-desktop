"""Set the package version to the output of `git describe`"""

import argparse
import json
import os.path
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', help="defaults to the output of `git describe`")
    args = parser.parse_args()
    version = args.version or subprocess.check_output(['git', 'describe']).strip()
    set_version(version)


def set_version(version):
    package_file = os.path.join('app', 'package.json')
    with open(package_file) as fp:
        package_data = json.load(fp)
    package_data['version'] = version
    with open(package_file, 'w') as fp:
        json.dump(package_data, fp, indent=2, separators=(',', ': '))
    with open(os.path.join('lbry', 'lbrynet', '__init__.py'), 'w') as fp:
        fp.write(LBRYNET_TEMPLATE.format(version=version))


LBRYNET_TEMPLATE = """
__version__ = "{version}"
version = tuple(__version__.split('.'))
"""


if __name__ == '__main__':
    sys.exit(main())
