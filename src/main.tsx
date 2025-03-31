
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using experimental version of React
console.log(`Running React version: ${React.version}`);

createRoot(document.getElementById("root")!).render(<App />);
