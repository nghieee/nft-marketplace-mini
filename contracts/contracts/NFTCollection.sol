// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTCollection
 * @dev ERC721 contract for minting NFTs in the marketplace
 */
contract NFTCollection is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public tokenCreators;
    
    // Mapping from token ID to rarity
    mapping(uint256 => string) public tokenRarities;
    
    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        string tokenURI,
        string rarity
    );
    
    constructor() ERC721("NFT Marketplace Collection", "NFTMC") Ownable(msg.sender) {
        // Start token IDs from 1
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Mint a new NFT
     * @param to Address to mint the NFT to
     * @param tokenURI Metadata URI for the NFT
     * @param rarity Rarity level of the NFT
     * @return tokenId The ID of the newly minted token
     */
    function mintNFT(
        address to,
        string memory tokenURI,
        string memory rarity
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set creator and rarity
        tokenCreators[tokenId] = msg.sender;
        tokenRarities[tokenId] = rarity;
        
        emit NFTMinted(tokenId, msg.sender, to, tokenURI, rarity);
        
        return tokenId;
    }
    
    /**
     * @dev Get the creator of a token
     * @param tokenId The token ID
     * @return The address of the token creator
     */
    function getTokenCreator(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenCreators[tokenId];
    }
    
    /**
     * @dev Get the rarity of a token
     * @param tokenId The token ID
     * @return The rarity string of the token
     */
    function getTokenRarity(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenRarities[tokenId];
    }
    
    /**
     * @dev Get the current token ID counter
     * @return The current token ID that would be minted next
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Get total number of tokens minted
     * @return Total supply of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Get all tokens owned by an address
     * @param owner The owner address
     * @return tokenIds Array of token IDs owned by the address
     */
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 currentIndex = 0;
        
        uint256 totalTokens = totalSupply();
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
