const { expect } = require("chai");

describe("nftMarketplace", async () => {
  let deployer, addr1, addr2;
  nft, marketplace;
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
  });
});
