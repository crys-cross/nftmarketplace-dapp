import { useState } from "react";
import { ethers } from "hardhat";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client/dist/src";

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState();
  const [price, setPrice] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await clientInformation.mediaDevices(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  const createNFT = async () => {};
  return (
    <div className="container-fluid mt-5">
      <div className="row"></div>
    </div>
  );
};

export default Create;
