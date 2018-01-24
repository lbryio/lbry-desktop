import glob
import json
import os
import platform
import subprocess
import sys

import github
import uritemplate
import boto3

def main():
    upload_to_github_if_tagged('lbryio/lbry-app')


def get_asset_path():
    this_dir = os.path.dirname(os.path.realpath(__file__))
    system = platform.system()
    if system == 'Darwin':
        suffix = 'dmg'
    elif system == 'Linux':
        suffix = 'deb'
    elif system == 'Windows':
        suffix = 'exe'
    else:
        raise Exception("I don't know about any artifact on {}".format(system))

    return os.path.realpath(glob.glob(this_dir + '/../dist/LBRY*.' + suffix)[0])

def get_update_asset_path():
    # Get the asset used used for updates. On Mac, this is a .zip; on
    # Windows it's just the installer file.
    if platform.system() == 'Darwin':
        this_dir = os.path.dirname(os.path.realpath(__file__))
        return os.path.realpath(glob.glob(this_dir + '/../dist/LBRY*.zip')[0])
    else:
        return get_asset_path()


def get_latest_file_path():
  # The update metadata file is called latest.yml on Windows, latest-mac.yml on
  # Mac, latest-linux.yml on Linux
  this_dir = os.path.dirname(os.path.realpath(__file__))

  latestfilematches = glob.glob(this_dir + '/../dist/latest*.yml')

  return latestfilematches[0] if latestfilematches else None

def upload_to_github_if_tagged(repo_name):
    try:
        current_tag = subprocess.check_output(
            ['git', 'describe', '--exact-match', 'HEAD']).strip()
    except subprocess.CalledProcessError:
        print 'Not uploading to GitHub as we are not currently on a tag'
        return 1

    print "Current tag: " + current_tag

    if 'GH_TOKEN' not in os.environ:
        print 'Must set GH_TOKEN in order to publish assets to a release'
        return 1

    gh_token = os.environ['GH_TOKEN']
    auth = github.Github(gh_token)
    repo = auth.get_repo(repo_name)

    if not check_repo_has_tag(repo, current_tag):
        print 'Tag {} is not in repo {}'.format(current_tag, repo)
        # TODO: maybe this should be an error
        return 1

    asset_path = get_asset_path()
    print "Uploading " + asset_path + " to Github tag " + current_tag
    release = get_github_release(repo, current_tag)
    upload_asset_to_github(release, asset_path, gh_token)


def check_repo_has_tag(repo, target_tag):
    tags = repo.get_tags().get_page(0)
    for tag in tags:
        if tag.name == target_tag:
            return True
    return False


def get_github_release(repo, current_tag):
    for release in repo.get_releases():
        if release.tag_name == current_tag:
            return release
    raise Exception('No release for {} was found'.format(current_tag))


def upload_asset_to_github(release, asset_to_upload, token):
    basename = os.path.basename(asset_to_upload)
    for asset in release.raw_data['assets']:
        if asset['name'] == basename:
            print 'File {} has already been uploaded to {}'.format(basename, release.tag_name)
            return

    upload_uri = uritemplate.expand(release.upload_url, {'name': basename})
    count = 0
    while count < 10:
        try:
            output = _curl_uploader(upload_uri, asset_to_upload, token)
            if 'errors' in output:
                raise Exception(output)
            else:
                print 'Successfully uploaded to {}'.format(output['browser_download_url'])
        except Exception:
            print 'Failed uploading on attempt {}'.format(count + 1)
            count += 1


def _curl_uploader(upload_uri, asset_to_upload, token):
    # using requests.post fails miserably with SSL EPIPE errors. I spent
    # half a day trying to debug before deciding to switch to curl.
    #
    # TODO: actually set the content type
    print 'Using curl to upload {} to {}'.format(asset_to_upload, upload_uri)
    cmd = [
        'curl',
        '-sS',
        '-X', 'POST',
        '-u', ':{}'.format(os.environ['GH_TOKEN']),
        '--header', 'Content-Type: application/octet-stream',
        '--data-binary', '@-',
        upload_uri
    ]
    # '-d', '{"some_key": "some_value"}',
    print 'Calling curl:'
    print cmd
    print
    with open(asset_to_upload, 'rb') as fp:
        p = subprocess.Popen(cmd, stdin=fp, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    stdout, stderr = p.communicate()
    print 'curl return code:', p.returncode
    if stderr:
        print 'stderr output from curl:'
        print stderr
    print 'stdout from curl:'
    print stdout
    return json.loads(stdout)


if __name__ == '__main__':
    sys.exit(main())
