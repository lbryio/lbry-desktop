pip install -r build\requirements.txt
python build\set_version.py

# Get the latest stable version of Node.js or io.js
Install-Product node $env:nodejs_version

# install node modules
npm install
cd app
npm install
cd ..

# build ui
cd ui
npm install
node_modules\.bin\node-sass --output dist\css --sourcemap=none scss\
node_modules\.bin\webpack
Copy-Item dist ..\app\ -recurse
cd ..

# get daemon and cli executable
$daemon_url = (Get-Content build\DAEMON_URL -Raw).replace("OSNAME", "windows")
Invoke-WebRequest -Uri $daemon_url -OutFile daemon.zip
Expand-Archive daemon.zip -DestinationPath app\dist\
dir app\dist\ # verify that daemon binary is there
rm daemon.zip

# build electron app
node_modules\.bin\build -p never
$binary_name = Get-ChildItem -Path dist -Filter '*.exe' -Name
$new_name = $binary_name -replace '^LBRY Setup (.*)\.exe$', 'LBRY_$1.exe'
Rename-Item -Path "dist\$binary_name" -NewName $new_name
dir dist # verify that binary was built/named correctly
python build\release_on_tag.py