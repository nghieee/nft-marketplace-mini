import { useState, useEffect } from 'react';
import { NFT } from './useNFTs';

// Extended NFT interface for marketplace
export interface MarketplaceNFT extends NFT {
  isForSale: boolean;
  price?: string;
  seller?: string;
  listingDate?: string;
}

// Mock marketplace NFTs - combines user NFTs + other sellers
const mockMarketplaceNFTs: MarketplaceNFT[] = [
  // Original marketplace NFTs
  {
    id: 'market-1',
    name: 'Cyber Punk #101',
    description: 'A futuristic cyberpunk character from the digital realm',
    image: '/api/placeholder/400/400',
    tokenId: '101',
    contractAddress: '0x1234...abcd',
    owner: '0xabcd1234567890123456789012345678901234abcd',
    seller: '0xabcd1234567890123456789012345678901234abcd',
    rarity: 'Rare',
    price: '0.25',
    category: 'Art',
    dateAcquired: '2024-01-20',
    isForSale: true,
    listingDate: '2024-01-22',
    metadata: {
      attributes: [
        { trait_type: 'Background', value: 'Neon City' },
        { trait_type: 'Eyes', value: 'Cyber Blue' },
        { trait_type: 'Rarity', value: 'Rare' }
      ]
    }
  },
  {
    id: 'market-2',
    name: 'Neon Ape #76',
    description: 'A vibrant neon ape with electric personality',
    image: '/api/placeholder/400/400',
    tokenId: '76',
    contractAddress: '0x1234...abcd',
    owner: '0xefgh5678901234567890123456789012345678efgh',
    seller: '0xefgh5678901234567890123456789012345678efgh',
    rarity: 'Epic',
    price: '0.5',
    category: 'Avatar',
    dateAcquired: '2024-01-18',
    isForSale: true,
    listingDate: '2024-01-21',
    metadata: {
      attributes: [
        { trait_type: 'Species', value: 'Ape' },
        { trait_type: 'Color', value: 'Neon' },
        { trait_type: 'Rarity', value: 'Epic' }
      ]
    }
  },
  {
    id: 'market-3',
    name: 'Meta Samurai',
    description: 'A legendary warrior from the metaverse',
    image: '/api/placeholder/400/400',
    tokenId: '888',
    contractAddress: '0x1234...abcd',
    owner: '0xijkl9012345678901234567890123456789012ijkl',
    seller: '0xijkl9012345678901234567890123456789012ijkl',
    rarity: 'Legendary',
    price: '1.2',
    category: 'Character',
    dateAcquired: '2024-01-15',
    isForSale: true,
    listingDate: '2024-01-20',
    metadata: {
      attributes: [
        { trait_type: 'Class', value: 'Samurai' },
        { trait_type: 'Weapon', value: 'Katana' },
        { trait_type: 'Rarity', value: 'Legendary' }
      ]
    }
  },
  {
    id: 'market-4',
    name: 'Future Cat',
    description: 'A cute futuristic cat companion',
    image: '/api/placeholder/400/400',
    tokenId: '42',
    contractAddress: '0x1234...abcd',
    owner: '0xmnop3456789012345678901234567890123456mnop',
    seller: '0xmnop3456789012345678901234567890123456mnop',
    rarity: 'Common',
    price: '0.05',
    category: 'Pet',
    dateAcquired: '2024-01-25',
    isForSale: true,
    listingDate: '2024-01-26',
    metadata: {
      attributes: [
        { trait_type: 'Species', value: 'Cat' },
        { trait_type: 'Era', value: 'Future' },
        { trait_type: 'Rarity', value: 'Common' }
      ]
    }
  },
  {
    id: 'market-5',
    name: 'Digital Dragon',
    description: 'A majestic digital dragon with mystical powers',
    image: '/api/placeholder/400/400',
    tokenId: '999',
    contractAddress: '0x1234...abcd',
    owner: '0xqrst7890123456789012345678901234567890qrst',
    seller: '0xqrst7890123456789012345678901234567890qrst',
    rarity: 'Legendary',
    price: '2.5',
    category: 'Mythical',
    dateAcquired: '2024-01-12',
    isForSale: true,
    listingDate: '2024-01-19',
    metadata: {
      attributes: [
        { trait_type: 'Species', value: 'Dragon' },
        { trait_type: 'Element', value: 'Digital' },
        { trait_type: 'Rarity', value: 'Legendary' }
      ]
    }
  },
  {
    id: 'market-6',
    name: 'Crypto Warrior',
    description: 'A battle-hardened warrior of the crypto realm',
    image: '/api/placeholder/400/400',
    tokenId: '555',
    contractAddress: '0x1234...abcd',
    owner: '0xuvwx1234567890123456789012345678901234uvwx',
    seller: '0xuvwx1234567890123456789012345678901234uvwx',
    rarity: 'Epic',
    price: '0.8',
    category: 'Character',
    dateAcquired: '2024-01-14',
    isForSale: true,
    listingDate: '2024-01-18',
    metadata: {
      attributes: [
        { trait_type: 'Class', value: 'Warrior' },
        { trait_type: 'Realm', value: 'Crypto' },
        { trait_type: 'Rarity', value: 'Epic' }
      ]
    }
  }
];

export function useMarketplaceNFTs() {
  const [nfts, setNfts] = useState<MarketplaceNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketplaceNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: Replace with real blockchain API call
        // const response = await fetch('/api/marketplace/nfts');
        // const data = await response.json();
        
        // For now, return mock data
        setNfts(mockMarketplaceNFTs);
      } catch (err) {
        setError('Failed to fetch marketplace NFTs');
        console.error('Error fetching marketplace NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceNFTs();
  }, []);

  const refreshMarketplace = () => {
    setNfts([]);
    // The useEffect will handle the refetch
  };

  const buyNFT = async (nftId: string) => {
    // TODO: Implement actual buy functionality with smart contracts
    console.log('Buying NFT:', nftId);
    
    // For demo, remove NFT from marketplace
    setNfts(prev => prev.filter(nft => nft.id !== nftId));
    
    return { success: true, transactionHash: '0x...' };
  };

  const addToFavorites = (nftId: string) => {
    // TODO: Implement favorites functionality
    console.log('Added to favorites:', nftId);
  };

  return {
    nfts,
    loading,
    error,
    refreshMarketplace,
    buyNFT,
    addToFavorites
  };
}
