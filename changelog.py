import argparse
import datetime
import re
import sys


CHANGELOG_START_RE = re.compile(r'^\#\# \[Unreleased\]')
CHANGELOG_END_RE = re.compile(r'^\#\# \[.*\] - \d{4}-\d{2}-\d{2}')
# if we come across a section header between two release section headers
# then we probably have an improperly formatted changelog
CHANGELOG_ERROR_RE = re.compile(r'^\#\# ')
SECTION_RE = re.compile(r'^\#\#\# (.*)$')
EMPTY_RE = re.compile(r'^\w*\*\w*$')
ENTRY_RE = re.compile(r'\* (.*)')
VALID_SECTIONS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security']


# allocate some entries to cut-down on merge conflicts
TEMPLATE = """## Added
  *
  *
  *

## Changed
  *
  *
  *

## Fixed
  *
  *
  *

"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('changelog')
    parser.add_argument('version')
    args = parser.parse_args()
    bump(changelog, version)


def bump(changelog, version):
    with open(changelog) as fp:
        lines = fp.readlines()

    start = []
    unreleased = []
    rest = []
    unreleased_start_found = False
    unreleased_end_found = False
    for line in lines:
        if not unreleased_start_found:
            start.append(line)
            if CHANGELOG_START_RE.search(line):
                unreleased_start_found = True
            continue
        if unreleased_end_found:
            rest.append(line)
            continue
        if CHANGELOG_END_RE.search(line):
            rest.append(line)
            unreleased_end_found = True
            continue
        if CHANGELOG_ERROR_RE.search(line):
            raise Exception(err.format(filename, 'unexpected section header found'))
        unreleased.append(line)

    today = datetime.datetime.today()
    header = '## [{}] - {}\n'.format(version, today.strftime('%Y-%m-%d'))
    released = normalize(unreleased)
    if not released:
        # If we don't have anything in the Unreleased section, then leave the
        # changelog as it is and return None
        return

    changelog_data = (
        ''.join(start) +
        TEMPLATE +
        header +
        '\n'.join(released) + '\n\n'
        + ''.join(rest)
    )
    with open(changelog, 'w') as fp:
        fp.write(changelog_data)
    return '\n'.join(released) + '\n\n'


def normalize(lines):
    """Parse a changelog entry and output a normalized form"""
    sections = {}
    current_section_name = None
    current_section_contents = []
    for line in lines:
        line = line.strip()
        if not line or EMPTY_RE.match(line):
            continue
        match = SECTION_RE.match(line)
        if match:
            if current_section_contents:
                sections[current_section_name] = current_section_contents
            current_section_contents = []
            current_section_name = match.group(1)
            if current_section_name not in VALID_SECTIONS:
                raise ValueError("Section '{}' is not valid".format(current_section_name))
            continue
        match = ENTRY_RE.match(line)
        if match:
            current_section_contents.append(match.group(1))
            continue
        raise Exception('Something is wrong with line: {}'.format(line))
    if current_section_contents:
        sections[current_section_name] = current_section_contents

    output = []
    for section in VALID_SECTIONS:
        if section not in sections:
            continue
        output.append('## {}'.format(section))
        for entry in sections[section]:
            output.append(' * {}'.format(entry))
    return output


if __name__ == '__main__':
    sys.exit(main())
