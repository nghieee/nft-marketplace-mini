// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketplace
 * @dev Marketplace contract for buying and selling NFTs
 */
contract NFTMarketplace is ReentrancyGuard, Ownable {
    uint256 private _listingIdCounter;
    
    // Marketplace fee percentage (2.5% = 250 basis points)
    uint256 public marketplaceFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 listedAt;
    }
    
    // Mapping from listing ID to listing details
    mapping(uint256 => Listing) public listings;
    
    // Mapping from NFT contract + token ID to listing ID
    mapping(address => mapping(uint256 => uint256)) public tokenToListing;
    
    // Events
    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    
    event NFTSold(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );
    
    event ListingCancelled(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller
    );
    
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor() Ownable(msg.sender) {
        // Start listing IDs from 1
        _listingIdCounter = 1;
    }
    
    /**
     * @dev List an NFT for sale
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to list
     * @param price Price in wei
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You don't own this NFT"
        );
        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved to transfer NFT"
        );
        require(
            tokenToListing[nftContract][tokenId] == 0,
            "NFT already listed"
        );
        
        uint256 listingId = _listingIdCounter;
        _listingIdCounter++;
        
        listings[listingId] = Listing({
            listingId: listingId,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            listedAt: block.timestamp
        });
        
        tokenToListing[nftContract][tokenId] = listingId;
        
        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);
    }
    
    /**
     * @dev Buy an NFT from the marketplace
     * @param listingId The listing ID to purchase
     */
    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");
        require(
            IERC721(listing.nftContract).ownerOf(listing.tokenId) == listing.seller,
            "Seller no longer owns NFT"
        );
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;
        
        // Mark listing as inactive
        listing.active = false;
        tokenToListing[listing.nftContract][listing.tokenId] = 0;
        
        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        
        // Transfer payment to seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Failed to send payment to seller");
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Failed to refund excess payment");
        }
        
        emit NFTSold(
            listingId,
            listing.nftContract,
            listing.tokenId,
            listing.seller,
            msg.sender,
            listing.price
        );
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId The listing ID to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(
            listing.seller == msg.sender || owner() == msg.sender,
            "Only seller or owner can cancel"
        );
        
        listing.active = false;
        tokenToListing[listing.nftContract][listing.tokenId] = 0;
        
        emit ListingCancelled(
            listingId,
            listing.nftContract,
            listing.tokenId,
            listing.seller
        );
    }
    
    /**
     * @dev Update marketplace fee (only owner)
     * @param newFee New fee in basis points (e.g., 250 = 2.5%)
     */
    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw accumulated fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    /**
     * @dev Get all active listings
     * @return activeListings Array of active listing IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 totalListings = _listingIdCounter - 1;
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }
        
        // Create array of active listing IDs
        uint256[] memory activeListings = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].active) {
                activeListings[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeListings;
    }
    
    /**
     * @dev Get listings by seller
     * @param seller The seller address
     * @return sellerListings Array of listing IDs by the seller
     */
    function getListingsBySeller(address seller) external view returns (uint256[] memory) {
        uint256 totalListings = _listingIdCounter - 1;
        uint256 sellerCount = 0;
        
        // Count seller's listings
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].seller == seller && listings[i].active) {
                sellerCount++;
            }
        }
        
        // Create array of seller's listing IDs
        uint256[] memory sellerListings = new uint256[](sellerCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].seller == seller && listings[i].active) {
                sellerListings[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return sellerListings;
    }
    
    /**
     * @dev Get listing details
     * @param listingId The listing ID
     * @return Listing details
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Get total number of listings created
     * @return Total listings count
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIdCounter - 1;
    }
}
