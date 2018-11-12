/* eslint-disable no-console */
import path from 'path';
import { spawn, execSync } from 'child_process';

export default class Daemon {
  static path = process.env.LBRY_DAEMON || path.join(__static, 'daemon/lbrynet-daemon');
  subprocess;
  handlers;

  constructor() {
    this.handlers = [];
  }

  launch() {
    console.log('Launching daemon:', Daemon.path);
    this.subprocess = spawn(Daemon.path);

    this.subprocess.stdout.on('data', data => console.log(`Daemon: ${data}`));
    this.subprocess.stderr.on('data', data => console.error(`Daemon: ${data}`));
    this.subprocess.on('exit', () => this.fire('exit'));
    this.subprocess.on('error', error => console.error(`Daemon: ${error}`));
  }

  quit() {
    if (process.platform === 'win32') {
      try {
        execSync(`taskkill /pid ${this.subprocess.pid} /t /f`);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      this.subprocess.kill();
    }
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
