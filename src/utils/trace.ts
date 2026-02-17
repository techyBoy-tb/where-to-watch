import { currentEnv } from "./environment";

const addColours = currentEnv === 'local';

const { log } = console;

const Reset = '\x1b[0m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgCyan = '\x1b[36m';

const info = (message?: any, ...rest: any[]) => {
  let msg = message;
  if (addColours) msg = `${FgCyan}${message}${Reset}`;
  __DEV__ && log(msg, ...rest);
};

const warn = (message?: any, ...rest: any[]) => {
  let msg = message;
  if (addColours) msg = `${FgYellow}${message}${Reset}`;
  __DEV__ && log(msg, ...rest);
};

const err = (message?: any, ...rest: any[]) => {
  let msg = message;
  if (addColours) msg = `${FgRed}${message}${Reset}`;
  __DEV__ && log(msg, ...rest);
};

const success = (message?: any, ...rest: any[]) => {
  let msg = message;
  if (addColours) msg = `${FgGreen}${message}${Reset}`;
  __DEV__ && log(msg, ...rest);
};

export { log, info, warn, err, success };
