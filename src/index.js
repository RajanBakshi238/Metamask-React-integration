import React from "react";
import ReactDOM from "react-dom/client";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App";
import App2 from "./App2";

import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Web3ReactProvider getLibrary={getLibrary}>
    <App2  />
  </Web3ReactProvider>

  // </React.StrictMode>
);
