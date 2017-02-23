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


NO_CHANGE = ('No change since the last release. This release is simply a placeholder'
             ' so that LBRY and LBRY App track the same version')
DEFAULT_BRANCHES = {
    'lbry': 'master',
    'lbry-app': 'master',
    'lbry-web-ui': 'development',
    'lbryum': 'master'
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("lbry_part", help="part of lbry version to bump")
    parser.add_argument("--lbryum_part", help="part of lbryum version to bump")
    parser.add_argument("--ui-part", help="part of the ui to bump")
    parser.add_argument("--branch", help="branch to use for each repo; useful for testing")
    parser.add_argument("--last-release")
    parser.add_argument("--skip-sanity-checks", action="store_true")
    parser.add_argument("--require-changelog", action="store_true")
    parser.add_argument("--skip-push", action="store_true",
                        help="Set to not push changes to remote repo")
    args = parser.parse_args()

    base = git.Repo(os.getcwd())
    branch = get_branch('lbry-app', args.branch)

    if not args.skip_sanity_checks:
        run_sanity_checks(base, branch)

    if args.last_release:
        last_release = args.last_release
    else:
        response = requests.get('https://api.github.com/repos/lbryio/lbry-app/releases/latest')
        data = response.json()
        last_release = data['tag_name']
        logging.info('Last release: %s', last_release)

    gh_token = os.environ['GH_TOKEN']
    auth = github.Github(gh_token)
    github_repo = auth.get_repo('lbryio/lbry-app')

    names = ['lbry', 'lbry-web-ui', 'lbryum']
    repos = [Repo(name, get_part(args, name)) for name in names]

    # in order to see if we've had any change in the submodule, we need to checkout
    # our last release, see what commit we were on, and then compare that to
    # current
    base.git.checkout(last_release)
    base.git.submodule('update')
    for repo in repos:
        repo.save_commit()

    base.git.checkout(branch)
    base.git.submodule('update')

    changelogs = {}

    for repo in repos:
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
        repo.bumpversion()

    release_msg = get_release_msg(changelogs, names)

    for name in names:
        base.git.add(name)
    subprocess.check_call(['bumpversion', args.lbry_part, '--allow-dirty'])

    current_tag = base.git.describe()

    github_repo.create_git_release(current_tag, current_tag, release_msg, draft=True)
    lbrynet_daemon_release_msg = changelogs.get('lbry', NO_CHANGE)
    auth.get_repo('lbryio/lbry').create_git_release(
        current_tag, current_tag, lbrynet_daemon_release_msg, draft=True)

    if not args.skip_push:
        for repo in repos:
            repo.git.push(follow_tags=True)
        base.git.push(follow_tags=True, recurse_submodules='check')
    else:
        logging.info('Skipping push; you will have to reset and delete tags if '
                     'you want to run this script again')


def get_branch(repo_name, override=None):
    if override:
        return override
    return DEFAULT_BRANCHES[repo_name]


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

    def requireNewVersion():
        print 'Install bumpversion: pip install -U git+https://github.com/lbryio/bumpversion.git'
        sys.exit(1)

    try:
        output = subprocess.check_output(['bumpversion', '-v'], stderr=subprocess.STDOUT)
        output = output.strip()
        if output != 'bumpversion 0.5.4-lbry':
            requireNewVersion()
    except (subprocess.CalledProcessError, OSError) as err:
        requireNewVersion()


def get_part(args, name):
    if name == 'lbry-web-ui':
        part = getattr(args, 'ui_part')
        return part or args.lbry_part
    else:
        return getattr(args, name + '_part')


class Repo(object):
    def __init__(self, name, part):
        self.name = name
        self.part = part
        self.directory = os.path.join(os.getcwd(), name)
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
