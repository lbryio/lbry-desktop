const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const app = express();

// TODO: Spawn separate threads so realtime status logging can be used
// without overwriting information/execptions logged by the compilers
const logRealtime = str => {
  let lineCount = (str.match(/\n/) || []).length + 1;
  console.log('\u001B[' + lineCount + 'F\u001B[G\u001B[2K' + str);
};

console.log(
  chalk.magenta(
    `Compiling ${chalk.underline('main')} and ${chalk.underline('render')}, this will take a while.`
  )
);

let [mainConfig, renderConfig] = require('../../../webpack.electron.config.js');

renderConfig = merge(renderConfig, {
  entry: { ui: ['webpack-hot-middleware/client'] },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
  },
});

const mainCompiler = webpack(mainConfig);
const mainInstance = middleware(mainCompiler, {
  logLevel: 'warn',
  writeToDisk: filename => {
    // console.log(`Writing '${filename}'.`);
    return true;
  },
});

const renderCompiler = webpack(renderConfig);
const renderInstance = middleware(renderCompiler, {
  logLevel: 'warn',
  publicPath: '/',
});
app.use(require('webpack-hot-middleware')(renderCompiler));
app.use(renderInstance);
app.use(express.static('dist/electron/static'));

app.listen(8080, () => {
  console.log(chalk.yellow.bold('Renderer listening on port 8080 (still compiling)'));
});

mainInstance.waitUntilValid(() =>
  console.log(chalk.green(`${chalk.underline('main')} compilation complete.`))
);
renderInstance.waitUntilValid(() =>
  console.log(chalk.green(`${chalk.underline('render')} compilation complete.`))
);

mainInstance.waitUntilValid(() => {
  console.log(chalk.yellow('Spawning electron...'));

  const electron = require('electron');
  const proc = require('child_process');

  const child = proc.spawn(electron, ['./dist/electron/webpack/main.js']);

  child.stdout.on('data', data => {
    console.log(data.toString());
  });

  process.on('SIGINT', function() {
    console.log('Killing threads...');

    child.kill('SIGINT');
    process.exit();
  });
});
