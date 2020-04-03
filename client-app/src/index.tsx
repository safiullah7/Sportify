import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.min.css'
import './app/layout/styles.css';
import App from './app/layout/App';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import * as serviceWorker from './serviceWorker';
import ScrollToTop from './app/layout/ScrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      {/* Changing from <BrowserRouter/> to <Router/> to redirect in agent.tsx
      when there is a 400s error by exporting history object and using it in
      agent.tsx */}
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
