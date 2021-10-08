import path from 'path';
import fs from 'fs';
import { spawn, execSync } from 'child_process';
import Lbry from 'lbry';

export default class Daemon {
  static lbrynetPath =
    process.env.LBRY_DAEMON ||
    (process.env.NODE_ENV === 'production'
      ? path.join(process.resourcesPath, 'static/daemon', 'lbrynet')
      : path.join(__static, 'daemon/lbrynet'));

  static headersPath =
    process.env.LBRY_DAEMON ||
    (process.env.NODE_ENV === 'production'
      ? path.join(process.resourcesPath, 'static/daemon', 'headers')
      : path.join(__static, 'daemon/headers'));

  subprocess;
  handlers;

  constructor() {
    this.handlers = [];
  }

  launch() {
    let flags = ['start'];

    if (fs.existsSync(Daemon.headersPath)) {
      flags.push(`--initial-headers=${Daemon.headersPath}`);
    }

    this.subprocess = spawn(Daemon.lbrynetPath, flags);
    this.subprocess.stdout.on('data', data => console.log(`Daemon: ${data}`));
    this.subprocess.stderr.on('data', data => console.error(`Daemon: ${data}`));
    this.subprocess.on('exit', () => this.fire('exit'));
    this.subprocess.on('error', error => console.error(`Daemon error: ${error}`));
  }

  quit() {
    Lbry.stop()
      .then()
      .catch(() => {
        if (process.platform === 'win32') {
          try {
            execSync(`taskkill /pid ${this.subprocess.pid} /t /f`);
          } catch (error) {
            console.error(error.message);
          }
        } else {
          this.subprocess.kill();
        }
      });
  }

  // Follows the publish/subscribe pattern

  // Subscribe method
  on(event, handler, context = handler) {
    this.handlers.push({ event, handler: handler.bind(context) });
  }

  // Publish method
  fire(event, args) {
    this.handlers.forEach(topic => {
      if (topic.event === event) topic.handler(args);
    });
  }
}
