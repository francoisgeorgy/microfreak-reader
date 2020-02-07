import React from 'react';
import ReactDOM from 'react-dom';
import './themes.css';
import './index.css';
import './print.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import List from "./List";

// noinspection JSUndefinedPropertyAssignment
global.dev = process.env.NODE_ENV === 'development';

function getUrlParams() {
    let params = {};
    window.location.href.slice(window.location.href.indexOf('?') + 1).split('&').map(hash => {
        let [key, value] = hash.split('=');
        params[key] = decodeURIComponent(value);
        return null;
    });
    return params;
}

const urlParams  = getUrlParams();
const list = urlParams["list"] && ["1", "y", "yes"].includes(urlParams["list"].toLowerCase());

if (list) {
    // document.body.className = "list";
    ReactDOM.render(<List />, document.getElementById('root'));
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
