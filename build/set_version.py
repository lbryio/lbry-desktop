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
        try:
            version = get_version_from_tag(tag)
        except InvalidVersionTag:
            # this should be an error but its easier to handle here
            # than in the calling scripts.
            print 'Tag cannot be converted to a version, Exitting'
            return
    set_version(version)


class InvalidVersionTag(Exception):
    pass


def get_version_from_tag(tag):
    match = re.match('v([\d.]+)', tag)
    if match:
        return match.group(1)
    else:
        raise InvalidVersionTag('Failed to parse version from tag {}'.format(tag))


def set_version(version):
    root_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    package_file = os.path.join(root_dir, 'app', 'package.json')
    with open(package_file) as fp:
        package_data = json.load(fp)
    package_data['version'] = version
    with open(package_file, 'w') as fp:
        json.dump(package_data, fp, indent=2, separators=(',', ': '))


if __name__ == '__main__':
    sys.exit(main())
