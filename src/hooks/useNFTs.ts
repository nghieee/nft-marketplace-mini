import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  rarity?: string;
  price?: string;
  category?: string;
  dateAcquired?: string;
  metadata?: any;
}

// Mock NFT data for demo - sẽ thay thế bằng real blockchain data sau
const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cyber Punk #101',
    description: 'A futuristic cyberpunk character',
    image: '/api/placeholder/400/400',
    tokenId: '101',
    contractAddress: '0x1234...abcd',
    owner: '0x1234567890123456789012345678901234567890',
    rarity: 'Epic',
    price: '1.5',
    category: 'Art',
    dateAcquired: '2024-01-15',
    metadata: {
      attributes: [
        { trait_type: 'Background', value: 'Neon City' },
        { trait_type: 'Eyes', value: 'Cyber Blue' },
        { trait_type: 'Rarity', value: 'Epic' }
      ]
    }
  },
  {
    id: '2',
    name: 'Digital Dragon #88',
    description: 'A mystical digital dragon',
    image: '/api/placeholder/400/400',
    tokenId: '88',
    contractAddress: '0x1234...abcd',
    owner: '0x1234567890123456789012345678901234567890',
    rarity: 'Legendary',
    price: '2.8',
    category: 'Mythical',
    dateAcquired: '2024-01-10',
    metadata: {
      attributes: [
        { trait_type: 'Element', value: 'Fire' },
        { trait_type: 'Wings', value: 'Crystal' },
        { trait_type: 'Rarity', value: 'Legendary' }
      ]
    }
  },
  {
    id: '3',
    name: 'Space Explorer #42',
    description: 'An intergalactic space explorer',
    image: '/api/placeholder/400/400',
    tokenId: '42',
    contractAddress: '0x1234...abcd',
    owner: '0x1234567890123456789012345678901234567890',
    rarity: 'Rare',
    price: '0.9',
    category: 'Character',
    dateAcquired: '2024-01-05',
    metadata: {
      attributes: [
        { trait_type: 'Suit', value: 'Quantum' },
        { trait_type: 'Helmet', value: 'Holographic' },
        { trait_type: 'Rarity', value: 'Rare' }
      ]
    }
  }
];

export function useNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setNfts([]);
      return;
    }

    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, return mock data
        // TODO: Replace with real blockchain API call
        // const response = await fetch(`/api/nfts/${address}`);
        // const data = await response.json();
        
        // Filter mock NFTs by current address (for demo)
        const userNFTs = mockNFTs.map(nft => ({
          ...nft,
          owner: address
        }));

        setNfts(userNFTs);
      } catch (err) {
        setError('Failed to fetch NFTs');
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address, isConnected]);

  const refreshNFTs = () => {
    if (isConnected && address) {
      // Trigger refetch
      setNfts([]);
      // The useEffect will handle the refetch
    }
  };

  return {
    nfts,
    loading,
    error,
    refreshNFTs
  };
}
