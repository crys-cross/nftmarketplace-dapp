const { expect } = require("chai");

describe("nftMarketplace", async () => {
  let deployer, addr1, addr2;
  nft, marketplace;
  let feePercent = 1;
  let URI = "Sample URI";
  beforeEach(async () => {
    // Get Signers
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract factories and deploy
    const nft = await (await ethers.getContractFactory("NFT")).deploy();
    const marketplace = await (
      await ethers.getContractFactory("Marketplace")
    ).deploy(feePercent);
  });
  describe("Deployment", () => {
    it("Should track name and symbol of the nft collection", async () => {
      expect(await nft.name()).to.equal("DApp NFT");
      expect(await nft.symbol()).to.equal("DAPP");
    });
    it("Should track feeAccount and feePercent of the marketplace", async () => {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });
  describe("Minting NFT's", () => {
    it("Should track each minted NFT", async () => {
      //addr1 mints an NFT
      await nft.connect(addr1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      //addr2 mints an NFT
      await nft.connect(addr2).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });
  describe("Making marketplace item", () => {
    beforeEach(async () => {
      //connect to addr1
      const nftAddr1 = nft.connect(addr1);
      // addr1 mints an NFT
      await nftAddr1.mint(URI);
      // addr1 approves marketplace to spend nft
      await nftAddr1.setApprovalForAll(marketplace.address, true);
    });
    it("Should track newly created item, transfer NFT from seller to marketplace and emit offered event", async () => {
      // addr1 offers their nft at a price of 1 ether
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, towei(1))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.address, 1, toWei(1), addr1.address);
      // owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // Item count should now be equals to 1
      expect(await nft.itemCount()).to.equal(1);
      //get item from items mapping then check fields to ensure they are correct
      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(1);
      expect(item.sold).to.equal(false);
    });
  });
});
