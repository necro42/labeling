import React from 'react';
import { Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import App from 'components/App';
import configure from 'store/configure';
import history from 'lib/history';

const store = configure();

const Root = ({location}) => {
    return (
        <CookiesProvider>
            <Provider store = {store}>
                <Router history = {history}>
                    <App style={"height: 100%; backgound : pink;"}/>
                </Router>
            </Provider>
        </CookiesProvider>
    )
}

export default Root;
