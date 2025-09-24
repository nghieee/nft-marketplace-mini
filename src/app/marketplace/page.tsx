"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMarketplaceNFTs, MarketplaceNFT } from "@/hooks/useMarketplaceNFTs";

// Moved to useMarketplaceNFTs hook

const categories = ["All", "Art", "Avatar", "Character", "Pet", "Mythical"];
const rarities = ["All", "Common", "Rare", "Epic", "Legendary"];
const sortOptions = ["Price: Low to High", "Price: High to Low", "Recently Added", "Most Popular"];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");
  const router = useRouter();

  // Wallet connection
  const { isConnected, address } = useAccount();

  // Marketplace NFTs hook
  const { nfts: marketplaceNFTs, loading, error, buyNFT, addToFavorites } = useMarketplaceNFTs();

  const filteredNFTs = marketplaceNFTs
    .filter((nft: MarketplaceNFT) => nft.name.toLowerCase().includes(search.toLowerCase()))
    .filter((nft: MarketplaceNFT) => selectedCategory === "All" || nft.category === selectedCategory)
    .filter((nft: MarketplaceNFT) => selectedRarity === "All" || nft.rarity === selectedRarity)
    .sort((a: MarketplaceNFT, b: MarketplaceNFT) => {
      switch (sortBy) {
        case "Price: Low to High":
          return parseFloat(a.price || "0") - parseFloat(b.price || "0");
        case "Price: High to Low":
          return parseFloat(b.price || "0") - parseFloat(a.price || "0");
        default:
          return 0;
      }
    });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-400 border-gray-400/30 bg-gray-400/10";
      case "Rare": return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case "Epic": return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      case "Legendary": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      default: return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const handleBuyNFT = async (nft: MarketplaceNFT) => {
    if (!isConnected) {
      alert('Please connect your wallet to buy NFTs');
      return;
    }

    try {
      const result = await buyNFT(nft.id);
      if (result.success) {
        alert(`Successfully bought ${nft.name}!`);
      }
    } catch (error) {
      alert('Failed to buy NFT. Please try again.');
    }
  };

  const handleAddToFavorites = (nft: MarketplaceNFT) => {
    addToFavorites(nft.id);
    // You could add a toast notification here
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <main className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-space-grotesk mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NFT Marketplace
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore, collect, and trade unique digital assets on the blockchain
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search NFTs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option} className="bg-gray-900">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Category</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        : "bg-black/20 border border-white/10 text-gray-300 hover:border-purple-500/30 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Rarity</h3>
              <div className="flex flex-wrap gap-3">
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedRarity === rarity
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        : "bg-black/20 border border-white/10 text-gray-300 hover:border-yellow-500/30 hover:text-white"
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-400">
              <span className="text-white font-semibold">{filteredNFTs.length}</span> NFTs found
              {(selectedCategory !== "All" || selectedRarity !== "All" || search) && (
                <span className="ml-2">
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 ml-2">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedRarity !== "All" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 ml-2">
                      {selectedRarity}
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 ml-2">
                      "{search}"
                    </span>
                  )}
                </span>
              )}
            </div>
            
            {(selectedCategory !== "All" || selectedRarity !== "All" || search) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedRarity("All");
                  setSearch("");
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
                  <div className="aspect-square bg-gray-700/50"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-700/50 rounded"></div>
                    <div className="h-3 bg-gray-700/30 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-700/30 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500/20 border border-red-500/30 px-6 py-2 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* NFT Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNFTs.map((nft) => (
            <div key={nft.id} className="group relative">
              {/* NFT Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                {/* NFT Image Placeholder */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">#{nft.id}</span>
                    </div>
                  </div>
                  
                  {/* Rarity Badge */}
                  {nft.rarity && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{nft.name}</h3>
                    <p className="text-gray-400 text-sm">
                      by {nft.seller ? formatAddress(nft.seller) : 'Unknown'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Current Price</div>
                      <div className="text-lg font-bold text-cyan-400">{nft.price || '0'} ETH</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Category</div>
                      <div className="text-sm font-medium text-purple-400">{nft.category || 'NFT'}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBuyNFT(nft)}
                      disabled={!isConnected}
                      className="flex-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl py-3 text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnected ? 'Buy Now' : 'Connect Wallet'}
                    </button>
                    <button 
                      onClick={() => handleAddToFavorites(nft)}
                      className="px-4 py-3 border border-white/10 rounded-xl text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredNFTs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No NFTs Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && filteredNFTs.length > 0 && (
          <div className="text-center mt-16">
            <button className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-black/20 backdrop-blur-sm px-8 py-4 text-white font-semibold transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/10">
              <span className="flex items-center space-x-2">
                <span>Load More NFTs</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
