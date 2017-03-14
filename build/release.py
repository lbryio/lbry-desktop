"""Trigger a release.

This script is to be run locally (not on a build server).
"""
import argparse
import contextlib
import logging
import os
import re
import subprocess
import sys

import git
import github
import requests

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
        "--lbryum-part", help="part of lbryum version to bump",
        choices=LBRYUM_PARTS
    )
    parser.add_argument("--branch", help="branch to use for each repo; useful for testing")
    parser.add_argument(
        "--last-release",
        help=("manually set the last release version. The default is to query and parse the"
              " value from the release page.")
    )
    parser.add_argument("--skip-sanity-checks", action="store_true")
    parser.add_argument(
        "--require-changelog", action="store_true",
        help=("Set this flag to raise an exception if a submodules has changes without a"
              " corresponding changelog entry. The default is to log a warning")
    )
    parser.add_argument("--skip-push", action="store_true",
                        help="Set to not push changes to remote repo")
    args = parser.parse_args()

    base = git.Repo(os.getcwd())
    branch = get_branch('lbry-app', args.branch)

    if not args.skip_sanity_checks:
        run_sanity_checks(base, branch)

    base_repo = Repo('lbry-app', args.lbry_part, os.getcwd())
    base_repo.assert_new_tag_is_absent()

    if args.last_release:
        last_release = args.last_release
    else:
        response = requests.get('https://api.github.com/repos/lbryio/lbry-app/releases/latest')
        data = response.json()
        last_release = data['tag_name']
        logging.info('Last release: %s', last_release)

    gh_token = get_gh_token()
    auth = github.Github(gh_token)
    github_repo = auth.get_repo('lbryio/lbry-app')

    names = ['lbry', 'lbryum']
    repos = {name: Repo(name, get_part(args, name)) for name in names}

    # in order to see if we've had any change in the submodule, we need to checkout
    # our last release, see what commit we were on, and then compare that to current
    base.git.checkout(last_release)
    base.git.submodule('update')
    for repo in repos.values():
        repo.save_commit()

    base.git.checkout(branch)
    base.git.submodule('update')

    changelogs = {}

    get_lbryum_part_if_needed(repos['lbryum'])

    for repo in repos.values():
        logging.info('Processing repo: %s', repo.name)
        repo.checkout(args.branch)
        if repo.has_changes():
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

    github_repo.create_git_release(current_tag, current_tag, release_msg, draft=True)
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
        gh_token = os.environ['GH_TOKEN']
    else:
        print """
Please enter your personal access token. If you don't have one
See https://github.com/lbryio/lbry-app/wiki/Release-Script#generate-a-personal-access-token
for instructions on how to generate one.

You can also set the GH_TOKEN environment variable to avoid seeing this message
in the future"""
        inpt = raw_input('token: ')
        gh_token = inpt.strip()
    return gh_token


def get_lbryum_part_if_needed(repo):
    if repo.has_changes() and not repo.part:
        get_lbryum_part(repo)


def get_lbryum_part(repo):
    print """The lbryum repo has changes but you didn't specify how to bump the
version. Please enter one of {}""".format(', '.join(LBRYUM_PARTS))
    while True:
        part = raw_input('part: ')
        if part in LBRYUM_PARTS:
            repo.part = part
            break
        print 'Invalid part. Enter one of {}'.format(', '.join(LBRYUM_PARTS))


def get_branch(repo_name, override=None):
    return override or 'master'


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

    def has_changes(self):
        logging.info('%s =? %s', self.git_repo.commit(), self.saved_commit)
        return self.git_repo.commit() != self.saved_commit

    def save_commit(self):
        self.saved_commit = self.git_repo.commit()

    def checkout(self, override=None):
        branch = get_branch(self.name, override)
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

    def reset(self):
        branch = get_branch(self.name)
        self.git_repo.git.reset(branch, hard=True)
        # TODO: also delete any extra tags that might have been added

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
