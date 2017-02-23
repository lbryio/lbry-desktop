import os
import platform
import subprocess
import sys
import zipfile


def main():
    tag = subprocess.check_output(['git', 'describe']).strip()
    zipfilename = 'lbrynet-daemon-{}-{}.zip'.format(tag, get_system_label())
    full_filename = os.path.join('dist', zipfilename)
    executable = 'lbrynet-daemon'
    if platform.system() == 'Windows':
        executable += '.exe'
    with zipfile.ZipFile(full_filename, 'w') as myzip:
        myzip.write(os.path.join('app', 'dist', executable), executable)


def get_system_label():
    system = platform.system()
    if system == 'Darwin':
        return 'macOS'
    else:
        return system


if __name__ == '__main__':
    sys.exit(main())
