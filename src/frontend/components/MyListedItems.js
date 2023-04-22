import { useState, useEffect } from "react";
import { ethers } from "hardhat";
import { Row, Col, Card } from "react-bootstrap";

const MyListedItems = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true);
  const [listedItems, setLitedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const loadListedItems = async () => {
    // load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];
    for (let index = 1; index <= itemCount; index++) {
      const i = await marketplace.items(index);
      if (i.seller.toLower() == account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadat stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
      }
    }
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  return <div>MyListedItems</div>;
};

export default MyListedItems;
