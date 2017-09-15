@echo off

set found=
for %%F in (
  "%~dp0\node_modules\node-sass\bin\node-sass"
  "%~dp0\node_modules\.bin\webpack"
) do if exist %%F (set found=1)
if not defined found EXIT

node %~dp0\node_modules\node-sass\bin\node-sass --output %~dp0\..\app\dist\css --sourcemap=none %~dp0\scss
%~dp0\node_modules\.bin\webpack --config %~dp0\webpack.dev.config.js --progress --colors --watch