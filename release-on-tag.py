import argparse
import glob
import json
import logging
import os
import platform
import re
import subprocess
import sys
import zipfile

import github
import requests
import uritemplate

from lbrynet.core import log_support


def main(args=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', help='artifact to publish')
    parser.add_argument('--label', help='text to append to `file`')
    parser.add_argument('--zip', action='store_true')
    parser.add_argument(
        '--force', action='store_true',
        help='ignores whether the repo is currently tagged, publishes a draft release')
    args = parser.parse_args(args)

    gh_token = os.environ['GH_TOKEN']
    auth = github.Github(gh_token)
    current_repo = auth.get_repo(current_repo_name())

    if args.file:
        artifact = args.file
    else:
        artifact = get_artifact()

    current_tag = None
    if not args.force:
        try:
            current_tag = subprocess.check_output(
                ['git', 'describe', '--exact-match', 'HEAD']).strip()
        except subprocess.CalledProcessError:
            log.info('Stopping as we are not currently on a tag')
            return
        if not check_repo_has_tag(current_repo, current_tag):
            log.info('Tag %s is not in repo %s', current_tag, current_repo)
            # TODO: maybe this should be an error
            return

    release = get_release(current_repo, current_tag, args.force)
    asset_to_upload = get_asset(artifact, args.label, args.zip)
    upload_asset(release, asset_to_upload, gh_token)


def get_system():
    system = platform.system()
    if system == 'Darwin':
        return 'macOS'
    else:
        return system


def current_repo_name():
    pattern = 'github.com[:/](.*)\.git'
    remote = subprocess.check_output('git remote -v'.split())
    m = re.search(pattern, remote)
    if not m:
        raise Exception('Unable to parse repo name from remote: {}'.format(remote))
    return m.group(1)


def check_repo_has_tag(repo, target_tag):
    tags = repo.get_tags().get_page(0)
    for tag in tags:
        if tag.name == target_tag:
            return True
    return False


def get_release(current_repo, current_tag=None, draft=False):
    assert current_tag or draft, 'either current_tag or draft must be set'
    need_new_release = True
    if not draft and current_tag:
        try:
            release = current_repo.get_release(current_tag)
            log.info('Using an existing release for %s', current_tag)
        except github.UnknownObjectException:
            need_new_release = True
    if draft or need_new_release:
        log.info('Creating a new release for %s:%s', current_repo, current_tag)
        tag = current_tag or 'draft'
        release_name = current_tag or 'draft'
        msg = 'Release' # TODO: parse changelogs to get a better message
        release = current_repo.create_git_release(tag, release_name, msg, draft)
    return release


def get_artifact():
    system = platform.system()
    if system == 'Darwin':
        return glob.glob('dist/mac/LBRY*.dmg')[0]
    elif system == 'Linux':
        return glob.glob('dist/LBRY*.deb')[0]
    else:
        raise Exception("I don't know about any artifact on {}".format(system))


def get_asset(filename, label=None, use_zip=False):
    if label:
        label = '-{}'.format(label)
    else:
        label = ''
    base, ext = os.path.splitext(filename)
    if use_zip:
        # TODO: probably want to clean this up
        zipfilename = '{}{}.zip'.format(base, label)
        with zipfile.ZipFile(zipfilename, 'w') as myzip:
            myzip.write(filename)
        asset_to_uplaod = zipfilename
    else:
        asset_to_upload = '{}{}{}'.format(base, label, ext)
    return asset_to_upload


def upload_asset(release, asset_to_upload, token):
    basename = os.path.basename(asset_to_upload)

    if is_asset_already_uploaded(release, basename):
        return

    upload_uri = uritemplate.expand(
        release.upload_url, {'name': basename, 'label': get_system()})
    # using requests.post fails miserably with SSL EPIPE errors. I spent
    # half a day trying to debug before deciding to switch to curl.
    cmd = [
        'curl', '-sS', '-X', 'POST', '-u', ':{}'.format(os.environ['GH_TOKEN']),
        '--header', 'Content-Type:application/zip',
        '--data-binary', '@{}'.format(asset_to_upload), upload_uri
    ]
    raw_output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    output = json.loads(raw_output)
    if 'errors' in output:
        raise Exception(output)
    else:
        log.info('Successfully uploaded to %s', output['browser_download_url'])


def is_asset_already_uploaded(release, basename):
    for asset in release.raw_data['assets']:
        if asset['name'] == basename:
            log.info('File %s has already been uploaded to %s', basename, release.tag_name)
            return True
    return False


if __name__ == '__main__':
    log = logging.getLogger('release-on-tag')
    log_support.configure_console(level='DEBUG')
    sys.exit(main())
else:
    log = logging.getLogger(__name__)
