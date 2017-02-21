"""Set the package version to the output of `git describe`"""

import argparse
import json
import os.path
import re
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', help="defaults to the output of `git describe`")
    args = parser.parse_args()
    if args.version:
        version = args.version
    else:
        tag = subprocess.check_output(['git', 'describe']).strip()
        version = get_version_from_tag(tag)
    set_version(version)


def get_version_from_tag(tag):
    match = re.match('v([\d.]+)', tag)
    if match:
        return match.group(1)
    else:
        raise Exception('Failed to parse version from tag {}'.format(tag))


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
