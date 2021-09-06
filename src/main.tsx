import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { KeyStateProvider } from './ui/KeyState';

ReactDOM.render(
  <React.StrictMode>
    <KeyStateProvider>
      <App />
    </KeyStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
