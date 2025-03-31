
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using experimental version of React
console.log(`Running React version: ${React.version}`);

// Check which rendering method is available
if (ReactDOM.createRoot) {
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
} else {
  // Fallback to legacy render method if createRoot is not available
  ReactDOM.render(<App />, document.getElementById("root"));
}
