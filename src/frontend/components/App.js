import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Navbar";
import Home from "./Home.js";
import Create from "./Create.js";
import MyListedItems from "./MyListedItems.js";
import MyPurchases from "./MyPurchases.js";
import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";
import { useState } from "react";
import { ethers } from "ethers";
import { Spinner } from "react-bootstrap";

function App() {
  const [account, setAccount] = useState(null);
  // metamask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // set signer
    const signer = provider.getSigner();

    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    // get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
  };

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 ms-3"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dapp University
        </a>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mx-auto mt-5">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <h1 className="mt-5">Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/frontend/components/App.js</code> and save to
                reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN{" "}
                <u>
                  <b>NOW! </b>
                </u>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
