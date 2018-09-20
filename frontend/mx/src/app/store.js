import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk'
import reducers from '../reducers'

export const configure = () => {
  const middlewares = [ thunk ];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  return createStore(reducers, undefined, applyMiddleware(...middlewares));
}
