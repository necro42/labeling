import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import modules from './modules';

const isDev = process.env.NODE_ENV === 'development';
const devtools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtools || compose;
// const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ; //redux 버전업으로 인한 오류가 있을경우 주석으로 사용
// const composeEnhancers = compose; //redux 버전업으로 인한 오류가 있을경우 주석으로 사용

const configure = (preloadedState) => createStore(modules, preloadedState, composeEnhancers(
    applyMiddleware(ReduxThunk)
));

export default configure;