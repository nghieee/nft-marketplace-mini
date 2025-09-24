import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFT_MARKETPLACE_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts';
import { parseEther } from 'viem';

export function useMintNFT() {
  const { address, chain } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = async (
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes?: Array<{ trait_type: string; value: string }>;
    },
    onSuccess?: (newNFT: any) => void
  ) => {
    if (!address || !chain) {
      setMintError('Please connect your wallet');
      return;
    }

    // For demo purposes, we'll use a mock metadata URI
    // In production, you'd upload to IPFS first
    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    setIsMinting(true);
    setMintError(null);
    setMintSuccess(false);

    try {
      // For demo, we'll simulate minting without actual contract
      // In production, you'd use the actual contract address
      
      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new NFT object for local state
      const newNFT = {
        id: Date.now().toString(),
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        tokenId: Math.floor(Math.random() * 10000).toString(),
        contractAddress: '0x1234...demo',
        rarity: metadata.attributes?.find(attr => attr.trait_type === 'Rarity')?.value || 'Common',
        category: metadata.attributes?.find(attr => attr.trait_type === 'Type')?.value || 'NFT',
        dateAcquired: new Date().toISOString().split('T')[0],
        metadata
      };

      // Simulate successful mint
      console.log('NFT minted successfully (demo):', {
        to: address,
        tokenURI,
        metadata,
        newNFT
      });

      setMintSuccess(true);
      
      // Call success callback with new NFT
      if (onSuccess) {
        onSuccess(newNFT);
      }

    } catch (err: any) {
      setMintError(err.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const mintWithPayment = async (
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes?: Array<{ trait_type: string; value: string }>;
    },
    mintPrice: string = '0.001' // ETH
  ) => {
    if (!address || !chain) {
      setMintError('Please connect your wallet');
      return;
    }

    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    setIsMinting(true);
    setMintError(null);

    try {
      // Simulate paid mint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual contract call
      /*
      const contractAddress = CONTRACT_ADDRESSES[chain.id as keyof typeof CONTRACT_ADDRESSES];
      
      writeContract({
        address: contractAddress,
        abi: NFT_MARKETPLACE_ABI,
        functionName: 'mint',
        args: [tokenURI],
        value: parseEther(mintPrice),
      });
      */

      console.log('NFT minted with payment (demo):', {
        to: address,
        tokenURI,
        metadata,
        price: mintPrice
      });

    } catch (err: any) {
      setMintError(err.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mintNFT,
    mintWithPayment,
    isMinting: isMinting || isPending || isConfirming,
    isSuccess: mintSuccess || isConfirmed,
    error: mintError || error?.message,
    hash
  };
}
