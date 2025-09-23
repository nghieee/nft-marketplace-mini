import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative text-center max-w-4xl mx-auto py-20 px-6">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight font-space-grotesk">
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Discover, Collect
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                & Trade NFTs
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The next-generation NFT marketplace built for{" "}
              <span className="text-purple-400 font-semibold">creators</span> and{" "}
              <span className="text-cyan-400 font-semibold">collectors</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="relative rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-white font-semibold transition-all duration-300">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Explore Marketplace</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </button>
            
            <button className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-black/20 backdrop-blur-sm px-8 py-4 text-white font-semibold transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/10">
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch Demo</span>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">10K+</div>
              <div className="text-gray-400 text-sm">NFTs Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">5K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">500+</div>
              <div className="text-gray-400 text-sm">Creators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending NFTs Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Trending NFTs
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the most popular and valuable NFTs in our marketplace
            </p>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, name: "Cosmic Warrior", price: "0.5", creator: "ArtistOne" },
              { id: 2, name: "Digital Dreams", price: "0.8", creator: "CryptoArt" },
              { id: 3, name: "Neon Future", price: "1.2", creator: "PixelMaster" }
            ].map((nft) => (
              <div key={nft.id} className="group relative">
                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                  {/* NFT Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">#{nft.id}</span>
                      </div>
                    </div>
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{nft.name}</h3>
                        <p className="text-gray-400 text-sm">by {nft.creator}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Current Bid</div>
                        <div className="text-lg font-bold text-cyan-400">{nft.price} ETH</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl py-3 text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-black/20 backdrop-blur-sm px-8 py-4 text-white font-semibold transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/10">
              <span className="flex items-center space-x-2">
                <span>View All NFTs</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
