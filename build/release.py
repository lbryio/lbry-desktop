"""Trigger a release.

This script is to be run locally (not on a build server).
"""
import argparse
import contextlib
import logging
import os
import re
import string
import subprocess
import sys

import git
import github

import changelog

# TODO: ask bumpversion for these
LBRY_PARTS = ('major', 'minor', 'patch', 'release', 'candidate')
LBRYUM_PARTS = ('major', 'minor', 'patch')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "lbry_part", help="part of lbry version to bump",
        choices=LBRY_PARTS
    )
    parser.add_argument(
        "--skip-lbryum", help="skip bumping lbryum, even if there are changes",
        action="store_true",
    )
    parser.add_argument(
        "--lbryum-part", help="part of lbryum version to bump",
        choices=LBRYUM_PARTS
    )
    parser.add_argument(
        "--last-release",
        help=("manually set the last release version. The default is to query and parse the"
              " value from the release page.")
    )
    parser.add_argument(
        "--skip-sanity-checks", action="store_true")
    parser.add_argument(
        "--require-changelog", action="store_true",
        help=("Set this flag to raise an exception if a submodules has changes without a"
              " corresponding changelog entry. The default is to log a warning")
    )
    parser.add_argument(
        "--skip-push", action="store_true",
        help="Set to not push changes to remote repo"
    )

    args = parser.parse_args()

    base = git.Repo(os.getcwd())
    branch = 'master'

    if not args.skip_sanity_checks:
        run_sanity_checks(base, branch)

    base_repo = Repo('lbry-app', args.lbry_part, os.getcwd())
    base_repo.assert_new_tag_is_absent()

    last_release = args.last_release or base_repo.get_last_tag()
    logging.info('Last release: %s', last_release)

    gh_token = get_gh_token()
    auth = github.Github(gh_token)
    github_repo = auth.get_repo('lbryio/lbry-app')

    names = ['lbryum', 'lbry']
    repos = {name: Repo(name, get_part(args, name)) for name in names}

    changelogs = {}

    for repo in repos.values():
        logging.info('Processing repo: %s', repo.name)
        repo.checkout(branch)
        last_submodule_hash = base_repo.get_submodule_hash(last_release, repo.name)
        if repo.has_changes_from_revision(last_submodule_hash):
            if repo.name == 'lbryum':
                if args.skip_lbryum:
                    continue
                if not repo.part:
                    repo.part = get_lbryum_part()
            entry = repo.get_changelog_entry()
            if entry:
                changelogs[repo.name] = entry.strip()
                repo.add_changelog()
            else:
                msg = 'Changelog entry is missing for {}'.format(repo.name)
                if args.require_changelog:
                    raise Exception(msg)
                else:
                    logging.warning(msg)
        else:
            logging.warning('Submodule %s has no changes.', repo.name)
            if repo.name == 'lbryum':
                # The other repos have their version track each other so need to bump
                # them even if there aren't any changes, but lbryum should only be
                # bumped if it has changes
                continue
        # bumpversion will fail if there is already the tag we want in the repo
        repo.assert_new_tag_is_absent()
        repo.bumpversion()

    release_msg = get_release_msg(changelogs, names)

    for name in names:
        base.git.add(name)

    base_repo.bumpversion()
    current_tag = base.git.describe()

    is_rc = re.match('\drc\d+$', current_tag) is not None

    github_repo.create_git_release(current_tag, current_tag, release_msg, draft=True,
                                   prerelease=is_rc)
    no_change_msg = ('No change since the last release. This release is simply a placeholder'
                     ' so that LBRY and LBRY App track the same version')
    lbrynet_daemon_release_msg = changelogs.get('lbry', no_change_msg)
    auth.get_repo('lbryio/lbry').create_git_release(
        current_tag, current_tag, lbrynet_daemon_release_msg, draft=True)

    if not args.skip_push:
        for repo in repos.values():
            repo.git.push(follow_tags=True)
        base.git.push(follow_tags=True, recurse_submodules='check')
    else:
        logging.info('Skipping push; you will have to reset and delete tags if '
                     'you want to run this script again. Take a look at reset.sh; '
                     'it probably does what you want.')


def get_gh_token():
    if 'GH_TOKEN' in os.environ:
        return os.environ['GH_TOKEN']
    else:
        print """
Please enter your personal access token. If you don't have one
See https://github.com/lbryio/lbry-app/wiki/Release-Script#generate-a-personal-access-token
for instructions on how to generate one.

You can also set the GH_TOKEN environment variable to avoid seeing this message
in the future"""
        return raw_input('token: ').strip()


def get_lbryum_part():
    print """The lbryum repo has changes but you didn't specify how to bump the
version. Please enter one of: {}""".format(', '.join(LBRYUM_PARTS))
    while True:
        part = raw_input('part: ').strip()
        if part in LBRYUM_PARTS:
            return part
        print 'Invalid part. Enter one of: {}'.format(', '.join(LBRYUM_PARTS))


def get_release_msg(changelogs, names):
    lines = []
    for name in names:
        entry = changelogs.get(name)
        if not entry:
            continue
        lines.append('## {}\n'.format(name))
        lines.append('{}\n'.format(entry))
    return '\n'.join(lines)


def run_sanity_checks(base, branch):
    if base.is_dirty():
        print 'Cowardly refusing to release a dirty repo'
        sys.exit(1)
    if base.active_branch.name != branch:
        print 'Cowardly refusing to release when not on the {} branch'.format(branch)
        sys.exit(1)
    if is_behind(base, branch):
        print 'Cowardly refusing to release when behind origin'
        sys.exit(1)
    check_bumpversion()


def is_behind(base, branch):
    base.remotes.origin.fetch()
    rev_list = '{branch}...origin/{branch}'.format(branch=branch)
    commits_behind = base.git.rev_list(rev_list, right_only=True, count=True)
    commits_behind = int(commits_behind)
    return commits_behind > 0


def check_bumpversion():
    def require_new_version():
        print 'Install bumpversion: pip install -U git+https://github.com/lbryio/bumpversion.git'
        sys.exit(1)

    try:
        output = subprocess.check_output(['bumpversion', '-v'], stderr=subprocess.STDOUT)
        output = output.strip()
        if output != 'bumpversion 0.5.4-lbry':
            require_new_version()
    except (subprocess.CalledProcessError, OSError) as err:
        require_new_version()


def get_part(args, name):
    return getattr(args, name + '_part') or args.lbry_part


class Repo(object):
    def __init__(self, name, part, directory=None):
        self.name = name
        self.part = part
        self.directory = directory or os.path.join(os.getcwd(), name)
        self.git_repo = git.Repo(self.directory)
        self.saved_commit = None
        self._bumped = False

    def get_last_tag(self):
        return string.split(self.git_repo.git.describe(tags=True), '-')[0]

    def get_submodule_hash(self, revision, submodule_path):
        line = getattr(self.git_repo.git, 'ls-tree')(revision, submodule_path)
        return string.split(line)[2] if line else None

    def has_changes_from_revision(self, revision):
        commit = str(self.git_repo.commit())
        logging.info('%s =? %s', commit, revision)
        return commit != revision

    def save_commit(self):
        self.saved_commit = self.git_repo.commit()
        logging.info('Saved ', self.git_repo.commit(), self.saved_commit)

    def checkout(self, branch):
        self.git_repo.git.checkout(branch)
        self.git_repo.git.pull(rebase=True)

    def get_changelog_entry(self):
        filename = os.path.join(self.directory, 'CHANGELOG.md')
        return changelog.bump(filename, self.new_version())

    def add_changelog(self):
        with pushd(self.directory):
            self.git_repo.git.add('CHANGELOG.md')

    def new_version(self):
        if self._bumped:
            raise Exception('Cannot calculate a new version on an already bumped repo')
        if not self.part:
            raise Exception('Cannot calculate a new version without a part')
        with pushd(self.directory):
            output = subprocess.check_output(
                ['bumpversion', '--dry-run', '--list', '--allow-dirty', self.part])
            return re.search('^new_version=(.*)$', output, re.M).group(1)

    def bumpversion(self):
        if self._bumped:
            raise Exception('Cowardly refusing to bump a repo twice')
        if not self.part:
            raise Exception('Cannot bump version for {}: no part specified'.format(repo.name))
        with pushd(self.directory):
            subprocess.check_call(['bumpversion', '--allow-dirty', self.part])
            self._bumped = True

    def assert_new_tag_is_absent(self):
        new_tag = 'v' + self.new_version()
        tags = self.git_repo.git.tag()
        if new_tag in tags.split('\n'):
            raise Exception('Tag {} is already present in repo {}.'.format(new_tag, self.name))

    @property
    def git(self):
        return self.git_repo.git


@contextlib.contextmanager
def pushd(new_dir):
    previous_dir = os.getcwd()
    os.chdir(new_dir)
    yield
    os.chdir(previous_dir)


if __name__ == '__main__':
    logging.basicConfig(
        format="%(asctime)s %(levelname)-8s %(name)s:%(lineno)d: %(message)s",
        level='INFO'
    )
    sys.exit(main())
else:
    log = logging.getLogger('__name__')
