
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'

// Using experimental version of React
console.log(`Running React version: ${React.version}`);

// With this experimental version, we should use the legacy render method
ReactDOM.render(<App />, document.getElementById("root"));
