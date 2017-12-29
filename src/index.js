import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/auditTime';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/withLatestFrom';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import store from './modules/store';

import PluginHub from './plugins/PluginHub';
import PluginLayout from './plugins/plugin-layout';
import PluginArtboard from './plugins/plugin-artboard';

import './style/global.scss';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

PluginHub.register(PluginLayout);
PluginHub.register(PluginArtboard);

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

const WithDrapAndDropContext = DragDropContext(HTML5Backend)(App);
ReactDOM.render(
  <Provider store={store}>
    <WithDrapAndDropContext />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
