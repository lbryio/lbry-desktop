rmdir %~dp0node_modules /s /q
rmdir %~dp0..\node_modules /s /q
rmdir %~dp0..\app\node_modules /s /q

call yarn install

echo f | xcopy /s /y %~dp0dist %~dp0..\app\dist

call %~dp0node_modules\.bin\node-sass --output %~dp0..\app\dist\css --sourcemap=none %~dp0scss\

start /min %~dp0node_modules\.bin\node-sass --output %~dp0..\app\dist\css --sourcemap=none --watch %~dp0scss\ &

call %~dp0node_modules\.bin\webpack --config webpack.dev.config.js --progress --colors

start /min %~dp0node_modules\.bin\webpack --config webpack.dev.config.js --progress --colors --watch

call yarn build:langs

cp %~dp0build\lang\en.json %~dp0..\app\dist\lang\en.json

cd %~dp0..\app

call yarn install

cd ..\

call yarn install

start /min %~dp0..\node_modules\.bin\electron app

exit 0


