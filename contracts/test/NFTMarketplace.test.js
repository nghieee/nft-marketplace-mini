const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nftCollection, nftMarketplace;
  let owner, seller, buyer, addr1;
  
  beforeEach(async function () {
    [owner, seller, buyer, addr1] = await ethers.getSigners();
    
    // Deploy NFTCollection
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    nftCollection = await NFTCollection.deploy();
    await nftCollection.waitForDeployment();
    
    // Deploy NFTMarketplace
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment();
    
    // Mint an NFT for testing
    await nftCollection.connect(seller).mintNFT(
      seller.address,
      "https://example.com/token/1",
      "Epic"
    );
    
    // Approve marketplace to transfer NFT
    await nftCollection.connect(seller).setApprovalForAll(
      await nftMarketplace.getAddress(),
      true
    );
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMarketplace.owner()).to.equal(owner.address);
    });
    
    it("Should have correct marketplace fee", async function () {
      expect(await nftMarketplace.marketplaceFee()).to.equal(250); // 2.5%
    });
  });
  
  describe("Listing NFTs", function () {
    it("Should list NFT successfully", async function () {
      const price = ethers.parseEther("1.0");
      
      const tx = await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        1,
        price
      );
      
      await expect(tx)
        .to.emit(nftMarketplace, "NFTListed")
        .withArgs(1, await nftCollection.getAddress(), 1, seller.address, price);
      
      const listing = await nftMarketplace.getListing(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.equal(true);
    });
    
    it("Should revert if price is zero", async function () {
      await expect(
        nftMarketplace.connect(seller).listNFT(
          await nftCollection.getAddress(),
          1,
          0
        )
      ).to.be.revertedWith("Price must be greater than 0");
    });
    
    it("Should revert if not NFT owner", async function () {
      await expect(
        nftMarketplace.connect(buyer).listNFT(
          await nftCollection.getAddress(),
          1,
          ethers.parseEther("1.0")
        )
      ).to.be.revertedWith("You don't own this NFT");
    });
    
    it("Should revert if marketplace not approved", async function () {
      // Revoke approval
      await nftCollection.connect(seller).setApprovalForAll(
        await nftMarketplace.getAddress(),
        false
      );
      
      await expect(
        nftMarketplace.connect(seller).listNFT(
          await nftCollection.getAddress(),
          1,
          ethers.parseEther("1.0")
        )
      ).to.be.revertedWith("Marketplace not approved to transfer NFT");
    });
  });
  
  describe("Buying NFTs", function () {
    beforeEach(async function () {
      // List the NFT
      await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        1,
        ethers.parseEther("1.0")
      );
    });
    
    it("Should buy NFT successfully", async function () {
      const price = ethers.parseEther("1.0");
      const fee = (price * 250n) / 10000n; // 2.5%
      const sellerAmount = price - fee;
      
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      const tx = await nftMarketplace.connect(buyer).buyNFT(1, {
        value: price
      });
      
      await expect(tx)
        .to.emit(nftMarketplace, "NFTSold")
        .withArgs(1, await nftCollection.getAddress(), 1, seller.address, buyer.address, price);
      
      // Check NFT ownership transferred
      expect(await nftCollection.ownerOf(1)).to.equal(buyer.address);
      
      // Check listing is inactive
      const listing = await nftMarketplace.getListing(1);
      expect(listing.active).to.equal(false);
      
      // Check seller received payment (minus gas costs)
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(sellerAmount);
    });
    
    it("Should refund excess payment", async function () {
      const price = ethers.parseEther("1.0");
      const overpayment = ethers.parseEther("1.5");
      
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      
      const tx = await nftMarketplace.connect(buyer).buyNFT(1, {
        value: overpayment
      });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      const expectedBalance = buyerBalanceBefore - price - gasUsed;
      
      expect(buyerBalanceAfter).to.equal(expectedBalance);
    });
    
    it("Should revert if insufficient payment", async function () {
      await expect(
        nftMarketplace.connect(buyer).buyNFT(1, {
          value: ethers.parseEther("0.5")
        })
      ).to.be.revertedWith("Insufficient payment");
    });
    
    it("Should revert if seller tries to buy own NFT", async function () {
      await expect(
        nftMarketplace.connect(seller).buyNFT(1, {
          value: ethers.parseEther("1.0")
        })
      ).to.be.revertedWith("Cannot buy your own NFT");
    });
  });
  
  describe("Cancelling Listings", function () {
    beforeEach(async function () {
      await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        1,
        ethers.parseEther("1.0")
      );
    });
    
    it("Should cancel listing successfully", async function () {
      const tx = await nftMarketplace.connect(seller).cancelListing(1);
      
      await expect(tx)
        .to.emit(nftMarketplace, "ListingCancelled")
        .withArgs(1, await nftCollection.getAddress(), 1, seller.address);
      
      const listing = await nftMarketplace.getListing(1);
      expect(listing.active).to.equal(false);
    });
    
    it("Should allow owner to cancel any listing", async function () {
      const tx = await nftMarketplace.connect(owner).cancelListing(1);
      
      await expect(tx)
        .to.emit(nftMarketplace, "ListingCancelled");
    });
    
    it("Should revert if not seller or owner", async function () {
      await expect(
        nftMarketplace.connect(buyer).cancelListing(1)
      ).to.be.revertedWith("Only seller or owner can cancel");
    });
  });
  
  describe("Marketplace Management", function () {
    it("Should update marketplace fee", async function () {
      const newFee = 500; // 5%
      
      const tx = await nftMarketplace.connect(owner).updateMarketplaceFee(newFee);
      
      await expect(tx)
        .to.emit(nftMarketplace, "MarketplaceFeeUpdated")
        .withArgs(250, newFee);
      
      expect(await nftMarketplace.marketplaceFee()).to.equal(newFee);
    });
    
    it("Should revert if fee exceeds 10%", async function () {
      await expect(
        nftMarketplace.connect(owner).updateMarketplaceFee(1001)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });
    
    it("Should withdraw fees", async function () {
      // List and buy NFT to generate fees
      await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        1,
        ethers.parseEther("1.0")
      );
      
      await nftMarketplace.connect(buyer).buyNFT(1, {
        value: ethers.parseEther("1.0")
      });
      
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const contractBalance = await ethers.provider.getBalance(await nftMarketplace.getAddress());
      
      const tx = await nftMarketplace.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore + gasUsed).to.equal(contractBalance);
    });
  });
  
  describe("View Functions", function () {
    beforeEach(async function () {
      // Mint and list multiple NFTs
      await nftCollection.connect(seller).mintNFT(
        seller.address,
        "https://example.com/token/2",
        "Rare"
      );
      
      await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        1,
        ethers.parseEther("1.0")
      );
      
      await nftMarketplace.connect(seller).listNFT(
        await nftCollection.getAddress(),
        2,
        ethers.parseEther("2.0")
      );
    });
    
    it("Should return active listings", async function () {
      const activeListings = await nftMarketplace.getActiveListings();
      expect(activeListings.length).to.equal(2);
      expect(activeListings[0]).to.equal(1);
      expect(activeListings[1]).to.equal(2);
    });
    
    it("Should return listings by seller", async function () {
      const sellerListings = await nftMarketplace.getListingsBySeller(seller.address);
      expect(sellerListings.length).to.equal(2);
    });
    
    it("Should return correct total listings", async function () {
      expect(await nftMarketplace.getTotalListings()).to.equal(2);
    });
  });
});
