
import React from 'react'
import ReactDOMClient from 'react-dom/client'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'

// Using experimental version of React
console.log(`Running React version: ${React.version}`);

// Check which rendering method is available
if (ReactDOMClient.createRoot) {
  // Modern React 18+ rendering
  ReactDOMClient.createRoot(document.getElementById("root")!).render(<App />);
} else {
  // Legacy React rendering (React 17 and earlier)
  ReactDOM.render(<App />, document.getElementById("root"));
}
