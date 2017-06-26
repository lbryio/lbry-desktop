pip install -r build\requirements.txt
python build\set_version.py


# Get the latest stable version of Node.js or io.js
Install-Product node $env:nodejs_version
npm install -g yarn
yarn install


# do app
cd app
yarn install
# necessary to ensure native Node modules (e.g. keytar) are built against the correct version of Node)
# yes, it needs to be run twice. it fails the first time, not sure why
node_modules\.bin\electron-rebuild
node_modules\.bin\electron-rebuild
cd ..


# build ui
cd ui
yarn install
npm rebuild node-sass
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


# sign binary
nuget install secure-file -ExcludeVersion
secure-file\tools\secure-file -decrypt build\lbry2.pfx.enc -secret "$env:pfx_key"
& ${env:SIGNTOOL_PATH} sign /f build\lbry2.pfx /p "$env:key_pass" /tr http://tsa.starfieldtech.com /td SHA256 /fd SHA256 dist\*.exe


python build\upload_assets.py