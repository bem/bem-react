import React from 'react';
import styled from 'styled-components';
import logo from './logo.svg';
import './App.css';

import Example from 'b:Example';

const StyledExample = styled(Example)`
    color: palevioletred;
`;

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
                <Example size="20px"/>
                <StyledExample size="14px"/>
            </p>
        </div>
    );
};

export default App;
