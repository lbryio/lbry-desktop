import path from 'path';
import { spawn, execSync } from 'child_process';

export default class LbryFirstInstance {
  static lbryFirstPath =
    process.env.LBRY_FIRST_DAEMON ||
    (process.env.NODE_ENV === 'production'
      ? path.join(process.resourcesPath, 'static/lbry-first', 'lbry-first')
      : path.join(__static, 'lbry-first/lbry-first'));

  static headersPath =
    process.env.LBRY_FIRST_DAEMON ||
    (process.env.NODE_ENV === 'production'
      ? path.join(process.resourcesPath, 'static/lbry-first', 'headers')
      : path.join(__static, 'lbry-first/headers'));

  subprocess;
  handlers;

  constructor() {
    this.handlers = [];
  }

  launch() {
    let flags = ['serve'];
    console.log(`LbryFirst: ${LbryFirstInstance.lbryFirstPath}`);
    this.subprocess = spawn(LbryFirstInstance.lbryFirstPath, flags);
    this.subprocess.stdout.on('data', data => console.log(`LbryFirst: ${data}`));
    this.subprocess.stderr.on('data', data => console.error(`LbryFirst: ${data}`));
    this.subprocess.on('exit', () => this.fire('exit'));
    this.subprocess.on('error', error => console.error(`LbryFirst error: ${error}`));
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
