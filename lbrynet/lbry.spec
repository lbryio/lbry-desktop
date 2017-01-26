# -*- mode: python -*-
import lbryum

block_cipher = None
languages = (
    'chinese_simplified.txt', 'japanese.txt', 'spanish.txt',
    'english.txt', 'portuguese.txt'
)


a = Analysis(
    ['lbry.py'],
    pathex=['/Users/jobevers/projects/lbryio/lbry-electron/lbrynet'],
    binaries=None,
    # Not sure why these files are not already include as they are
    # listed in package_data and the MANIFEST.in, but they don't seem
    # to make it in unless we explicitly add them here
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
    excludes=['win32com'],
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
    exclude_binaries=True,
    name='lbry',
    debug=False,
    strip=False,
    upx=True,
    console=True,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    name='lbry'
)
app = BUNDLE(
    coll,
    name='lbry.app',
    icon=None,
    bundle_identifier=None
)
