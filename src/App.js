import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

import "./App.css";

function App() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

  const injected = new InjectedConnector({
    supportedChainIds: [56],
  });

  console.log(active, ">>>>>>>>>>>>>>>>>>>>>>");
  useEffect(() => {
    console.log(active);
    console.log(account);
    console.log(library);
    console.log(connector, ".........");
  }, [account, active, library, connector]);

  useEffect(() => {
    if (!active) {
      const testRes = connector?.handleChainChanged(56)
      console.log(testRes, "tesRes");
    }
  }, [connector]);

  const connectWallet = async () => {
    if (window.ethereum) {
      console.log("test ethereum is going on......", window.ethereum);

      // console.log(Web3.utils.toHex(1), '>>>>>>>>>>>>')
      try {
        await switchMetamaskNetwork().then((res) => {
          if (res === "OK") {
            console.log("connected");
          } else if (res === "NOTOK") {
            // something went wrong not connected
          }
        });
      } catch (error) {
        console.log(error, "ERROE WHILE CONNECTING TO METAMASK");
      }
    } else {
      window.open(`https://metamask.app.link/dapp/${window.location.href}`);
      console.log("Meta mask not found......");
    }
  };

  const switchMetamaskNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(56) }],
      });
      return "OK";
    } catch (e) {
      // chainId not recogonized , have to add the chain to wallet
      if (e.code === 4902) {
        return await addNetworkToMetamask();
      }
      console.log(e, "error of switch metamask network");
      // user rejected to switch
      if (e.code === 4001) {
        console.log(e.message);
      }
    }
  };

  const addNetworkToMetamask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: Web3.utils.toHex(56),
            chainName: "BNB Smart Chain",
            nativeCurrency: {
              name: "Binance Coin",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
          },
        ],
      });
      return "OK";
    } catch (err) {
      console.log(err);
      // user rejected to switch
      if (err.code === 4001) {
        console.log(err.message);
      }
      return "NOTOK";
    }
  };

  const connectWallet2 = async () => {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        console.log(accounts, ">>>>>>>>>>>ConnectWallet2");
        const response = await activate(injected);
        console.log(response, "reponse");
        if (active) {
          console.log("AT RIGHT PLACE");
        } else {
          console.log("not at right place");
          // const testRes = connector.handleChainChanged(56);
          // console.log(testRes, 'tesRes')
        }
      })
      .catch((err) => {
        // Already processing request
        if (err.code === -32002) {
          console.log(err.message);
        }
        console.log(err, ">>>>>>>>>>>ConnectWallet2");
      });
  };

  return (
    <div className="app">
      <button onClick={connectWallet} className="connect_btn">
        Connect to Metamask
      </button>
      <br />
      <button onClick={connectWallet2} className="connect_btn">
        Connect to Metamask 2
      </button>
    </div>
  );
}

export default App;
