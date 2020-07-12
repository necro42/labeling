import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import HomeComponent from './HomeComponent'
import ImageComponent from './ImageComponent'

function App() {
    return (
        <>
        <Switch>
            <Route path="/:seq" component={ImageComponent} />
            <Route path="/" component={HomeComponent} />
        </Switch>
        </>
    );
}

export default App;
