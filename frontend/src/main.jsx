import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Ensure your Tailwind CSS configuration imports load correctly here

// Direct global style reset to safeguard standard DOM width calculations
const styleElement = document.createElement("style");
styleElement.innerHTML = `
  html, body, #root {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
document.head.appendChild(styleElement);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);