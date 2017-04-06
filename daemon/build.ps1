$env:Path += ";C:\MinGW\bin\"

$env:Path += ";C:\Program Files (x86)\Windows Kits\10\bin\x86\"
gcc --version
mingw32-make --version

# build/install miniupnpc manually
tar zxf miniupnpc-1.9.tar.gz
cd miniupnpc-1.9
mingw32-make.exe -f Makefile.mingw
python.exe setupmingw32.py build --compiler=mingw32
python.exe setupmingw32.py install
cd ..\
Remove-Item -Recurse -Force miniupnpc-1.9

# copy requirements from lbry, but remove lbryum (we'll add it back in below) and gmpy and miniupnpc (installed manually)
Get-Content ..\lbry\requirements.txt | Select-String -Pattern 'lbryum|gmpy|miniupnpc' -NotMatch | Out-File requirements.txt
# add in gmpy wheel
Add-Content requirements.txt "./gmpy-1.17-cp27-none-win32.whl"
# for electron, we install lbryum and lbry using submodules
Add-Content requirements.txt "../lbryum"
Add-Content requirements.txt "../lbry"

pip.exe install pyinstaller
pip.exe install -r requirements.txt

pyinstaller -y daemon.onefile.spec
pyinstaller -y cli.onefile.spec