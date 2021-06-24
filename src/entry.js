import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import {store} from './reducer'
import ControlApp from './containers/ControlApp'
require('bootstrap-loader');

var numberLocalizer = require('react-widgets/lib/localizers/simple-number');
numberLocalizer();

ReactDOM.render(
    <Provider store={store}>
        <ControlApp />
    </Provider>, document.getElementById("mountNode"));