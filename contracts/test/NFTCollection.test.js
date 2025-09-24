const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTCollection", function () {
  let nftCollection;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    nftCollection = await NFTCollection.deploy();
    await nftCollection.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftCollection.owner()).to.equal(owner.address);
    });
    
    it("Should have correct name and symbol", async function () {
      expect(await nftCollection.name()).to.equal("NFT Marketplace Collection");
      expect(await nftCollection.symbol()).to.equal("NFTMC");
    });
    
    it("Should start with token ID 1", async function () {
      expect(await nftCollection.getCurrentTokenId()).to.equal(1);
    });
  });
  
  describe("Minting", function () {
    it("Should mint NFT with correct properties", async function () {
      const tokenURI = "https://example.com/token/1";
      const rarity = "Epic";
      
      const tx = await nftCollection.connect(addr1).mintNFT(
        addr1.address,
        tokenURI,
        rarity
      );
      
      await expect(tx)
        .to.emit(nftCollection, "NFTMinted")
        .withArgs(1, addr1.address, addr1.address, tokenURI, rarity);
      
      expect(await nftCollection.ownerOf(1)).to.equal(addr1.address);
      expect(await nftCollection.tokenURI(1)).to.equal(tokenURI);
      expect(await nftCollection.getTokenCreator(1)).to.equal(addr1.address);
      expect(await nftCollection.getTokenRarity(1)).to.equal(rarity);
    });
    
    it("Should increment token ID after minting", async function () {
      await nftCollection.connect(addr1).mintNFT(
        addr1.address,
        "https://example.com/token/1",
        "Common"
      );
      
      expect(await nftCollection.getCurrentTokenId()).to.equal(2);
      expect(await nftCollection.totalSupply()).to.equal(1);
    });
    
    it("Should allow minting to different address", async function () {
      await nftCollection.connect(addr1).mintNFT(
        addr2.address,
        "https://example.com/token/1",
        "Rare"
      );
      
      expect(await nftCollection.ownerOf(1)).to.equal(addr2.address);
      expect(await nftCollection.getTokenCreator(1)).to.equal(addr1.address);
    });
  });
  
  describe("Token Management", function () {
    beforeEach(async function () {
      // Mint some tokens for testing
      await nftCollection.connect(addr1).mintNFT(
        addr1.address,
        "https://example.com/token/1",
        "Common"
      );
      await nftCollection.connect(addr1).mintNFT(
        addr1.address,
        "https://example.com/token/2",
        "Rare"
      );
      await nftCollection.connect(addr2).mintNFT(
        addr2.address,
        "https://example.com/token/3",
        "Epic"
      );
    });
    
    it("Should return correct tokens by owner", async function () {
      const addr1Tokens = await nftCollection.getTokensByOwner(addr1.address);
      const addr2Tokens = await nftCollection.getTokensByOwner(addr2.address);
      
      expect(addr1Tokens.length).to.equal(2);
      expect(addr1Tokens[0]).to.equal(1);
      expect(addr1Tokens[1]).to.equal(2);
      
      expect(addr2Tokens.length).to.equal(1);
      expect(addr2Tokens[0]).to.equal(3);
    });
    
    it("Should return correct balance", async function () {
      expect(await nftCollection.balanceOf(addr1.address)).to.equal(2);
      expect(await nftCollection.balanceOf(addr2.address)).to.equal(1);
    });
    
    it("Should return correct total supply", async function () {
      expect(await nftCollection.totalSupply()).to.equal(3);
    });
  });
  
  describe("Error Handling", function () {
    it("Should revert when querying non-existent token", async function () {
      await expect(nftCollection.getTokenCreator(999))
        .to.be.revertedWith("Token does not exist");
      
      await expect(nftCollection.getTokenRarity(999))
        .to.be.revertedWith("Token does not exist");
    });
  });
});
