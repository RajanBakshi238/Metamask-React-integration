import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

import "./App.css";

function App2() {
  const [web3, setWeb3] = useState();
  const { active, account, chainId, library, connector, activate, deactivate } =
    useWeb3React();

  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
  });

  useEffect(() => {
    if (active || localStorage.getItem("meta_wallet_account_id")) {
      activate(injected)
        .then((res) => {
          console.log(res, "res123456789");
        })
        .catch((err) => {
          console.log(err, "err123456789");
        });
      console.log("test");
    }
    setWeb3(new Web3(window.ethereum));
  }, []);

  console.log(web3, "web3 instatintated");

  useEffect(() => {
    (async function () {
      if (web3) {
        console.log("test iiiiiife");
        var testttt = await window.ethereum.enable();
        var accounts = await web3.eth.getAccounts();
        console.log(accounts)
        web3.eth
          .getBalance(accounts[0])
          .then(res => console.log(web3.utils.fromWei(res, 'ether') , 'response from then block'));
        console.log(accounts, "ACCOUNTS ");
      }
    })();
  }, [web3]);

  useEffect(() => {
    if (active) {
      localStorage.setItem("meta_wallet_account_id", account);
      if (chainId !== 56) {
        console.log("switch network function called .............");
        switchNetwork();
      }
    }
  }, [active]);

  useEffect(() => {
    console.log(active, "....active...");
    console.log(account, ".......account......");
    console.log(library, ".......library.....");
    console.log(connector, ".........");
    console.log(chainId, "chainID.........");
  }, [account, active, library, connector]);

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(56) }],
      });
    } catch (switchError) {
      // 4902 error code indicates the chain is missing on the wallet
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
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
        } catch (error) {
          console.error(error);
        }
      }
      //   user rejected the request to switch network
      else if (switchError.code === 4001) {
        console.log(switchError.message);
      }
      console.log(switchError, "?>>>>>>>>>>>>>>>>>>>SWITCH ERROR");
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
          //   switchNetwork();
          // const testRes = connector.handleChainChanged(56);
          // console.log(testRes, 'tesRes')
        }
        console.log(account, "....................ACCOUNT ..MUNAWAR");
        // localStorage.setItem("meta_wallet_account_id", )
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
      <button onClick={connectWallet2} className="connect_btn">
        Connect to Metamask 2
      </button>
      <br />
      <br />
      <button onClick={deactivate} className="connect_btn">
        Deactivate
      </button>
      <br />
      <br />
      <div className="detail-box">
        <p className="left-block">20 BNB</p>
        <p className="right-block">{account}</p>
      </div>
    </div>
  );
}

export default App2;
