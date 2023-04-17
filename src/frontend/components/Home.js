import { useState } from "react";
import { ethers } from "hardhat";
import { Row, Col, Button } from "react-bootstrap";

const Home = ({ marketplace, nft }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadMarketplace = async () => {
    const iteCount = await marketplace.iteCount();
    let items = [];
    for (let i = 1; i <= iteCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadatastored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item(item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setItems(items);
  };

  return <div className="flex justify-center">Home</div>;
};

export default Home;
