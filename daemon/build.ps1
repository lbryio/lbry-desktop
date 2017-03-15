$env:Path += ";C:\MinGW\bin\"

$env:Path += ";C:\Program Files (x86)\Windows Kits\10\bin\x86\"
gcc --version
mingw32-make --version

mkdir temp
Invoke-WebRequest "https://pypi.python.org/packages/55/90/e987e28ed29b571f315afea7d317b6bf4a551e37386b344190cffec60e72/miniupnpc-1.9.tar.gz" -OutFile "temp\miniupnpc-1.9.tar.gz"
cd temp
tar zxf miniupnpc-1.9.tar.gz
cd miniupnpc-1.9
mingw32-make.exe -f Makefile.mingw
python.exe setupmingw32.py build --compiler=mingw32
python.exe setupmingw32.py install

cd ..\..\
Remove-Item -Recurse -Force temp

pip.exe install pyinstaller
pip.exe install -r windows.txt

pyinstaller -y daemon.onefile.spec
pyinstaller -y cli.onefile.spec