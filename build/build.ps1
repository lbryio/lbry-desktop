pip install -r build\requirements.txt

# Decrypt cert
nuget install secure-file -ExcludeVersion
secure-file\tools\secure-file -decrypt build\lbry3.pfx.enc -secret "$env:pfx_key"

# Get the latest stable version of Node.js or io.js
Install-Product node $env:nodejs_version
npm install -g yarn
yarn install

# clean dist\
if (Test-Path -Path dist\) {
    Remove-Item -Recurse -Force dist\
}
New-Item -ItemType directory -Path dist\

# get daemon and cli executable
$package_settings = (Get-Content package.json -Raw | ConvertFrom-Json).lbrySettings
$daemon_ver = $package_settings.lbrynetDaemonVersion
$daemon_url_template = $package_settings.lbrynetDaemonUrlTemplate
$daemon_url = $daemon_url_template.Replace('OSNAME', 'windows').Replace('DAEMONVER', $daemon_ver)
Invoke-WebRequest -Uri $daemon_url -OutFile daemon.zip
Expand-Archive daemon.zip -DestinationPath static\daemon\
dir static\daemon\ # verify that daemon binary is there
rm daemon.zip

# build electron app
yarn build
dir dist # verify that binary was built/named correctly

python build\upload_assets.py
