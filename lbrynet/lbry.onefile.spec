# -*- mode: python -*-
import platform
import os

import lbryum

cwd = os.getcwd()
if os.path.basename(cwd) != 'lbrynet':
    raise Exception('The build needs to be run from the same directory as the spec file')
repo_base = os.path.abspath(os.path.join(cwd, '..'))

system = platform.system()
if system == 'Darwin':
    icns = os.path.join(repo_base, 'build', 'icon.icns')
else:
    icns = os.path.join(repo_base, 'package', 'icons', '256x256.png')

block_cipher = None
languages = (
    'chinese_simplified.txt', 'japanese.txt', 'spanish.txt',
    'english.txt', 'portuguese.txt'
)

a = Analysis(
    ['lbry.py'],
    pathex=[cwd],
    binaries=None,
    datas=[
        (
            os.path.join(os.path.dirname(lbryum.__file__), 'wordlist', language),
            'lbryum/wordlist'
        )
        for language in languages
    ],
    hiddenimports=[],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher
)

pyz = PYZ(
    a.pure, a.zipped_data,
    cipher=block_cipher
)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    name='lbry',
    debug=False,
    strip=False,
    upx=True,
    console=False,
    icon=icns
)

app = BUNDLE(
    exe,
    name='lbry.app',
    icon=icns,
    bundle_identifier=None
)
