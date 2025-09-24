'use client';

import { useState } from 'react';
import { useMintNFT } from '@/hooks/useMintNFT';
import { useAccount } from 'wagmi';

interface MintNFTProps {
  onMintSuccess?: (newNFT: any) => void;
}

export function MintNFT({ onMintSuccess }: MintNFTProps) {
  const { isConnected } = useAccount();
  const { mintNFT, isMinting, error, isSuccess } = useMintNFT();
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintType, setMintType] = useState<'demo' | 'paid'>('demo');

  // Pre-defined NFT templates for demo
  const nftTemplates = [
    {
      name: 'Cosmic Explorer #' + Math.floor(Math.random() * 1000),
      description: 'A brave explorer of the cosmic realms',
      image: '/api/placeholder/400/400',
      attributes: [
        { trait_type: 'Type', value: 'Explorer' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Element', value: 'Cosmic' }
      ]
    },
    {
      name: 'Digital Warrior #' + Math.floor(Math.random() * 1000),
      description: 'A fierce warrior from the digital realm',
      image: '/api/placeholder/400/400',
      attributes: [
        { trait_type: 'Type', value: 'Warrior' },
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Element', value: 'Digital' }
      ]
    },
    {
      name: 'Mystic Guardian #' + Math.floor(Math.random() * 1000),
      description: 'A mystical guardian of ancient secrets',
      image: '/api/placeholder/400/400',
      attributes: [
        { trait_type: 'Type', value: 'Guardian' },
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Element', value: 'Mystic' }
      ]
    }
  ];

  const handleMint = async () => {
    const randomTemplate = nftTemplates[Math.floor(Math.random() * nftTemplates.length)];
    
    try {
      await mintNFT(randomTemplate, (newNFT) => {
        if (onMintSuccess) {
          onMintSuccess(newNFT);
        }
        setShowMintModal(false);
      });
    } catch (err) {
      console.error('Mint failed:', err);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <>
      {/* Mint Button */}
      <button
        onClick={() => setShowMintModal(true)}
        className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Mint NFT Demo</span>
      </button>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Mint NFT Demo</h3>
              <button
                onClick={() => setShowMintModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* NFT Preview */}
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Random NFT</h4>
                <p className="text-gray-400 text-sm">You'll receive a randomly generated NFT from our collection</p>
              </div>

              {/* Mint Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Mint Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMintType('demo')}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      mintType === 'demo'
                        ? 'border-purple-500/50 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-black/20 text-gray-400 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">Free Demo</div>
                      <div className="text-xs">For testing</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMintType('paid')}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      mintType === 'paid'
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                        : 'border-white/10 bg-black/20 text-gray-400 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">0.001 ETH</div>
                      <div className="text-xs">Paid mint</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Display */}
              {isSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 text-sm">NFT minted successfully! Check your collection.</p>
                </div>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isMinting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Mint NFT {mintType === 'paid' ? '(0.001 ETH)' : '(Free)'}</span>
                  </>
                )}
              </button>

              {/* Disclaimer */}
              <div className="text-xs text-gray-400 text-center">
                <p>This is a demo mint on testnet. No real ETH will be charged.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
