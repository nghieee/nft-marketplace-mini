import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFT } from './useNFTs';
import { MarketplaceNFT } from './useMarketplaceNFTs';

export function useSellNFT() {
  const { address, isConnected } = useAccount();
  const [isSelling, setIsSelling] = useState(false);
  const [sellError, setSellError] = useState<string | null>(null);
  const [sellSuccess, setSellSuccess] = useState(false);

  const listNFTForSale = async (
    nft: NFT,
    price: string,
    onSuccess?: (marketplaceNFT: MarketplaceNFT) => void
  ) => {
    if (!isConnected || !address) {
      setSellError('Please connect your wallet');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setSellError('Please enter a valid price');
      return;
    }

    setIsSelling(true);
    setSellError(null);
    setSellSuccess(false);

    try {
      // Simulate listing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Replace with actual smart contract call
      /*
      const contractAddress = MARKETPLACE_CONTRACT_ADDRESS;
      
      // First approve NFT for marketplace
      await writeContract({
        address: nft.contractAddress,
        abi: ERC721_ABI,
        functionName: 'approve',
        args: [contractAddress, nft.tokenId],
      });

      // Then list NFT for sale
      await writeContract({
        address: contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'listNFT',
        args: [nft.contractAddress, nft.tokenId, parseEther(price)],
      });
      */

      // Create marketplace NFT object
      const marketplaceNFT: MarketplaceNFT = {
        ...nft,
        isForSale: true,
        price: price,
        seller: address,
        listingDate: new Date().toISOString().split('T')[0],
      };

      console.log('NFT listed for sale (demo):', {
        nft: nft.name,
        price: `${price} ETH`,
        seller: address,
        marketplaceNFT
      });

      setSellSuccess(true);

      // Call success callback
      if (onSuccess) {
        onSuccess(marketplaceNFT);
      }

    } catch (err: any) {
      setSellError(err.message || 'Failed to list NFT for sale');
    } finally {
      setIsSelling(false);
    }
  };

  const cancelListing = async (nftId: string) => {
    if (!isConnected || !address) {
      setSellError('Please connect your wallet');
      return;
    }

    setIsSelling(true);
    setSellError(null);

    try {
      // Simulate cancel delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Replace with actual smart contract call
      /*
      await writeContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: 'cancelListing',
        args: [nftId],
      });
      */

      console.log('Listing cancelled (demo):', nftId);
      
    } catch (err: any) {
      setSellError(err.message || 'Failed to cancel listing');
    } finally {
      setIsSelling(false);
    }
  };

  const validatePrice = (price: string): string | null => {
    if (!price.trim()) {
      return 'Price is required';
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return 'Price must be a valid number';
    }

    if (numPrice <= 0) {
      return 'Price must be greater than 0';
    }

    // No hard limits - owner's freedom to set price

    // Check decimal places (max 6 decimal places for ETH)
    const decimalPlaces = (price.split('.')[1] || '').length;
    if (decimalPlaces > 6) {
      return 'Price can have maximum 6 decimal places';
    }

    return null;
  };

  return {
    listNFTForSale,
    cancelListing,
    validatePrice,
    isSelling,
    sellError,
    sellSuccess,
    setSellError,
    setSellSuccess
  };
}
