$env:Path += ";C:\MinGW\bin\"

$env:Path += ";C:\Program Files (x86)\Windows Kits\10\bin\x86\"
gcc --version
mingw32-make --version

mkdir temp
mv miniupnpc-1.9.tar.gz temp\miniupnpc-1.9.tar.gz
cd temp
tar zxf miniupnpc-1.9.tar.gz
cd miniupnpc-1.9
mingw32-make.exe -f Makefile.mingw
python.exe setupmingw32.py build --compiler=mingw32
python.exe setupmingw32.py install

cd ..\..\
Remove-Item -Recurse -Force temp

# copy requirements from lbry, but remove lbryum (we'll add it back in below) and gmpy and miniupnpc (installed manually)
$Skip = @("*lbryum*","*gmpy*","*miniupnpc*")
Get-Content ..\lbry\requirements.txt | Where-Object {$_ -notlike $Skip} | Set-Content requirements.txt
# for electron, we install lbryum and lbry using submodules
Add-Content requirements.txt "`n../lbryum"
Add-Content requirements.txt "`n../lbry"
Get-Content requirements.txt

pip.exe install pyinstaller
pip.exe install -r windows.txt

pyinstaller -y daemon.onefile.spec
pyinstaller -y cli.onefile.spec