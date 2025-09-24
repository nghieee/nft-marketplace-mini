'use client';

import { useState } from 'react';
import { useSellNFT } from '@/hooks/useSellNFT';
import { NFT } from '@/hooks/useNFTs';
import { MarketplaceNFT } from '@/hooks/useMarketplaceNFTs';
import { Portal } from './portal';

interface SellNFTProps {
  nft: NFT;
  onSellSuccess?: (marketplaceNFT: MarketplaceNFT) => void;
}

export function SellNFT({ nft, onSellSuccess }: SellNFTProps) {
  const [showSellModal, setShowSellModal] = useState(false);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);
  const [showHighPriceWarning, setShowHighPriceWarning] = useState(false);
  const [confirmedHighPrice, setConfirmedHighPrice] = useState(false);

  const { 
    listNFTForSale, 
    validatePrice, 
    isSelling, 
    sellError, 
    sellSuccess,
    setSellError,
    setSellSuccess
  } = useSellNFT();

  const handlePriceChange = (value: string) => {
    setPrice(value);
    setPriceError(null);
    setSellError(null);
    setShowHighPriceWarning(false);
    setConfirmedHighPrice(false);
  };

  const handleSellNFT = async () => {
    // Validate price
    const validation = validatePrice(price);
    if (validation) {
      setPriceError(validation);
      return;
    }

    // Check for high price warning
    const numPrice = parseFloat(price);
    if (numPrice > 1000 && !confirmedHighPrice) {
      setShowHighPriceWarning(true);
      return;
    }

    try {
      await listNFTForSale(nft, price, (marketplaceNFT) => {
        if (onSellSuccess) {
          onSellSuccess(marketplaceNFT);
        }
        // Close modal after successful sale
        setTimeout(() => {
          setShowSellModal(false);
          setPrice('');
          setPriceError(null);
          setSellSuccess(false);
          setShowHighPriceWarning(false);
          setConfirmedHighPrice(false);
        }, 2000);
      });
    } catch (error) {
      console.error('Sell failed:', error);
    }
  };

  const handleConfirmHighPrice = () => {
    setConfirmedHighPrice(true);
    setShowHighPriceWarning(false);
  };

  const handleCloseModal = () => {
    setShowSellModal(false);
    setPrice('');
    setPriceError(null);
    setSellError(null);
    setSellSuccess(false);
    setShowHighPriceWarning(false);
    setConfirmedHighPrice(false);
  };

  return (
    <>
      {/* Sell Button */}
      <button
        onClick={() => setShowSellModal(true)}
        className="flex-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl py-3 text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25"
      >
        List for Sale
      </button>

      {/* Sell Modal */}
      {showSellModal && (
        <Portal>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">List NFT for Sale</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* NFT Preview */}
                <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-white">#{nft.tokenId}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{nft.name}</h4>
                      <p className="text-gray-400 text-sm">{nft.description || 'Your NFT'}</p>
                      {nft.rarity && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 mt-1">
                          {nft.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Set Price (ETH)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.1"
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      ETH
                    </div>
                  </div>
                  
                  {/* Price suggestions */}
                  <div className="flex gap-2">
                    {['0.01', '0.1', '0.5', '1.0'].map((suggestedPrice) => (
                      <button
                        key={suggestedPrice}
                        onClick={() => handlePriceChange(suggestedPrice)}
                        className="px-3 py-1 text-xs bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-colors"
                      >
                        {suggestedPrice}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Error */}
                {priceError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{priceError}</p>
                  </div>
                )}

                {/* Sell Error */}
                {sellError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{sellError}</p>
                  </div>
                )}

                {/* High Price Warning */}
                {showHighPriceWarning && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-yellow-400 font-medium mb-2">High Price Alert</h5>
                        <p className="text-yellow-300 text-sm mb-3">
                          You're setting a very high price of <strong>{parseFloat(price).toLocaleString()} ETH</strong>. 
                          This might make your NFT difficult to sell. Are you sure you want to continue?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleConfirmHighPrice}
                            className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-colors text-sm"
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            onClick={() => setShowHighPriceWarning(false)}
                            className="px-4 py-2 border border-gray-500/30 rounded-lg text-gray-300 hover:border-gray-400/30 transition-colors text-sm"
                          >
                            Let me reconsider
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {sellSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-400 text-sm">
                      🎉 NFT listed successfully! It will appear in the marketplace.
                    </p>
                  </div>
                )}

                {/* Listing Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h5 className="text-blue-400 font-medium mb-2">Listing Details:</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Your NFT will be listed on the marketplace</li>
                    <li>• You can cancel the listing anytime</li>
                    <li>• 2.5% marketplace fee applies on sale</li>
                    <li>• Demo mode - no real transaction</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    disabled={isSelling}
                    className="flex-1 border border-white/10 px-6 py-3 rounded-xl text-gray-300 hover:border-gray-500/30 hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSellNFT}
                    disabled={isSelling || !price || !!priceError}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-0"
                  >
                    {isSelling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0"></div>
                        <span className="truncate">Listing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="truncate">
                          {confirmedHighPrice && parseFloat(price || '0') > 1000 ? 'Confirm List' : 'List'} for {parseFloat(price || '0') > 999999 
                            ? `${(parseFloat(price || '0') / 1000000).toFixed(1)}M` 
                            : parseFloat(price || '0') > 999 
                              ? `${(parseFloat(price || '0') / 1000).toFixed(1)}K`
                              : price || '0'
                          } ETH
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
