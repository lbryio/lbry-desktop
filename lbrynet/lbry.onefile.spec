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
    console=False , icon='/Users/jobevers/projects/lbryio/lbry-electron/package/osx/app.icns'
)

app = BUNDLE(
    exe,
    name='lbry.app',
    icon='/Users/jobevers/projects/lbryio/lbry-electron/package/osx/app.icns',
    bundle_identifier=None
)
