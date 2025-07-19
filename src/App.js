
import React from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import { Button } from 'antd';


const App = () => (
  <div className={styles.container}>
    <header>
      <img src={logo} alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <div>
        <Button type="primary">Ant Design Button</Button>
      </div>
    </header>
  </div>
);

export default App;
