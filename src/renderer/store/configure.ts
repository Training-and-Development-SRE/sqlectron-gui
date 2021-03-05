import { createStore, applyMiddleware } from 'redux';
import { createLogger as createReduxLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { CONFIG } from '../api';
import { createLogger } from '../../browser/remote';

const middlewares = [thunkMiddleware];

/* eslint global-require:0 */
const isLogConsoleEnabled = CONFIG.log.console;
const isLogFileEnabled = CONFIG.log.file;

if (isLogConsoleEnabled || isLogFileEnabled) {
  const loggerConfig = {
    level: CONFIG.log.level,
    collapsed: true,
    logger: {},
  };

  const mainLogger = isLogFileEnabled ? createLogger('renderer:redux') : null;

  for (const method in console) {
    // eslint-disable-line no-restricted-syntax
    if (typeof console[method] === 'function') {
      // eslint-disable-line no-console
      loggerConfig.logger[method] = function levelFn(...args) {
        if (isLogConsoleEnabled) {
          const m = method === 'debug' ? 'log' : method;
          console[m](...args); // eslint-disable-line no-console
        }

        if (isLogFileEnabled) {
          // log on file only messages with error
          // otherwise is too much private information
          // the user would need to remove to issue a bug
          const lastArg = args[args.length - 1];
          if (lastArg && lastArg.error) {
            mainLogger.error('Error', lastArg.error);
            mainLogger.error('Error Stack', lastArg.error.stack);
          }
        }
      };
    }
  }

  middlewares.push(createReduxLogger(loggerConfig));
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState?) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
  }

  return store;
}
