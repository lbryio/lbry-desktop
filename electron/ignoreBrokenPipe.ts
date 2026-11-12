/*
  Logging must never take the app down (#601).

  When stdout/stderr is a pipe whose reader has gone (the launcher that started
  us exited, or the output was piped into something that quit), writes fail
  with EPIPE. Node's console only listens for errors during each write, so an
  EPIPE that arrives afterwards is an uncaught exception, and our
  uncaughtException handler shows an error box and quits. The daemon's output
  is forwarded to console.log, so it hits this a few minutes after launch.

  A permanent "error" listener drops broken-pipe errors and rethrows anything
  else, so other stream errors still surface as before.
*/
const BROKEN_PIPE_CODES = new Set(["EPIPE", "ERR_STREAM_DESTROYED"]);

export default function ignoreBrokenPipe(...streams: NodeJS.WritableStream[]) {
  for (const stream of streams) {
    stream.on("error", (error: NodeJS.ErrnoException) => {
      if (error && error.code && BROKEN_PIPE_CODES.has(error.code)) return;
      throw error;
    });
  }
}
