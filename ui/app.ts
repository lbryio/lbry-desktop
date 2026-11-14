//@ts-nocheck
import { store } from "store";

const env = process.env.NODE_ENV || "production";

const logs: unknown = [];
const app = {
  env,
  store,
  logs,
  log(message: unknown) {
    logs.push(message);
  },
} as const;

global.app = app;

// Lbryinc needs access to the redux store for dispatching auth-related actions
global.store = app.store;

export default app;
