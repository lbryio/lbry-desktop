"""Set the package version to the output of `git describe`"""

import json
import os.path
import subprocess
import sys


def main():
    version = subprocess.check_output(['git', 'describe']).strip()
    package_file = os.path.join('app', 'package.json')
    with open(package_file) as fp:
        package_data = json.load(fp)
    package_data['version'] = version
    with open(package_file, 'w') as fp:
        json.dump(package_data, fp, indent=2, separators=(',', ': '))


if __name__ == '__main__':
    sys.exit(main())
