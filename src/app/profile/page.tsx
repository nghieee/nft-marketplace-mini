"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount, useBalance, useEnsName } from "wagmi";
import { CustomConnectButton } from "@/components/connect-button";
import { useNFTs } from "@/hooks/useNFTs";
import { MintNFT } from "@/components/mint-nft";
import { SellNFT } from "@/components/sell-nft";

const ownedNFTs = [
  {
    id: 1,
    name: "Holo Tiger #88",
    price: "1.5",
    creator: "You",
    category: "Art",
    rarity: "Epic",
    dateAcquired: "2024-01-15",
  },
  {
    id: 2,
    name: "Pixel Samurai",
    price: "0.8",
    creator: "You", 
    category: "Character",
    rarity: "Rare",
    dateAcquired: "2024-01-10",
  },
  {
    id: 3,
    name: "Quantum Fox",
    price: "2.1",
    creator: "You",
    category: "Mythical", 
    rarity: "Legendary",
    dateAcquired: "2024-01-05",
  },
];

const userStats = {
  totalNFTs: 3,
  totalValue: "4.4",
  totalSales: "12.8",
  rank: "#247"
};

const tabs = ["Owned", "Created", "Activity", "Favorites"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Owned");
  
  // Wagmi hooks for wallet data
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { data: ensName } = useEnsName({
    address: address,
  });

  // NFT data hook
  const { nfts, loading: nftsLoading, error: nftsError, refreshNFTs, addNewNFT, removeNFT } = useNFTs();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-400 border-gray-400/30 bg-gray-400/10";
      case "Rare": return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case "Epic": return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      case "Legendary": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      default: return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  // Helper functions
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSellSuccess = (nft: any, marketplaceNFT: any) => {
    // Remove NFT from profile
    removeNFT(nft.id);
    
    // In a real app, you would also add to marketplace
    // For demo, we'll just show success message
    console.log('NFT moved to marketplace:', marketplaceNFT);
  };

  return (
    <main className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="relative mb-16">
          {/* Cover Background */}
          <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-16 text-center">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">U</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-6 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold font-space-grotesk">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {ensName || "CryptoCollector"}
                </span>
              </h1>
              
              {isConnected && address ? (
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span className="font-mono text-sm">{formatAddress(address)}</span>
                  <button 
                    onClick={() => copyToClipboard(address)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Copy address"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <p>Connect your wallet using the header button</p>
                </div>
              )}

              {/* Chain Info */}
              {isConnected && chain && (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Connected to {chain.name}</span>
                </div>
              )}

              {/* Balance Info */}
              {balance && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </div>
                  <div className="text-gray-400 text-sm">Wallet Balance</div>
                </div>
              )}

              <p className="text-gray-400 max-w-md mx-auto">
                Digital art collector and blockchain enthusiast. Passionate about discovering unique NFTs and supporting creators.
              </p>

              {/* Action Buttons - Only show when connected */}
              {isConnected && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <MintNFT onMintSuccess={addNewNFT} />
                  <button className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => address && copyToClipboard(address)}
                    className="border border-purple-500/30 bg-black/20 backdrop-blur-sm px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/10"
                  >
                    Share Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {isConnected ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {nftsLoading ? "..." : nfts.length}
              </div>
              <div className="text-gray-400 text-sm mt-1">NFTs Owned</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {balance ? parseFloat(balance.formatted).toFixed(2) : "0.00"} {balance?.symbol || "ETH"}
              </div>
              <div className="text-gray-400 text-sm mt-1">Wallet Balance</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {userStats.totalSales} ETH
              </div>
              <div className="text-gray-400 text-sm mt-1">Total Sales</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {chain?.name || "Unknown"}
              </div>
              <div className="text-gray-400 text-sm mt-1">Network</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Wallet Not Connected</h3>
            <p className="text-gray-400 mb-6">Connect your wallet using the button in the header to view your profile and stats</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
                activeTab === tab
                  ? "text-white border-purple-400"
                  : "text-gray-400 border-transparent hover:text-white hover:border-purple-400/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "Owned" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-space-grotesk">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  My Collection
                </span>
              </h2>
              <Link href="/marketplace" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-2">
                <span>Browse More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {nftsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
                      <div className="aspect-square bg-gray-700/50"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-700/50 rounded"></div>
                        <div className="h-3 bg-gray-700/30 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {nfts.map((nft) => (
                  <div key={nft.id} className="group relative">
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
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-1">{nft.name}</h3>
                          {nft.dateAcquired && (
                            <p className="text-gray-400 text-sm">Acquired on {new Date(nft.dateAcquired).toLocaleDateString()}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-sm text-gray-400">Token ID</div>
                            <div className="text-lg font-bold text-cyan-400">#{nft.tokenId}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Category</div>
                            <div className="text-sm font-medium text-purple-400">{nft.category || 'NFT'}</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <SellNFT 
                            nft={nft} 
                            onSellSuccess={(marketplaceNFT) => handleSellSuccess(nft, marketplaceNFT)} 
                          />
                          <button className="px-4 py-3 border border-white/10 rounded-xl text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No NFTs Yet</h3>
                <p className="text-gray-400 mb-6">Start building your collection by exploring the marketplace</p>
                <Link href="/marketplace" className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 inline-block">
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "Created" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Created NFTs</h3>
            <p className="text-gray-400 mb-6">You haven't created any NFTs yet</p>
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
              Create NFT
            </button>
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "Purchased", nft: "Holo Tiger #88", price: "1.5 ETH", time: "2 hours ago" },
                { action: "Listed", nft: "Pixel Samurai", price: "0.8 ETH", time: "1 day ago" },
                { action: "Sold", nft: "Quantum Fox", price: "2.1 ETH", time: "3 days ago" },
              ].map((activity, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{activity.action} {activity.nft}</div>
                      <div className="text-gray-400 text-sm">{activity.time}</div>
                    </div>
                  </div>
                  <div className="text-cyan-400 font-bold">{activity.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Favorites" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">Heart NFTs you love to add them to your favorites</p>
            <Link href="/marketplace" className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 inline-block">
              Explore NFTs
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
