import { Token } from "@uniswap/sdk-core";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { POOL_FACTORY_CONTRACT_ADDRESS } from "../constants";
import { makeProviderRequest } from "./provider";

// All available fee tiers in Uniswap V3
export const ALL_FEE_TIERS = [
  FeeAmount.LOWEST,  // 0.01% (100)
  FeeAmount.LOW,     // 0.05% (500) 
  FeeAmount.MEDIUM,  // 0.3% (3000)
  FeeAmount.HIGH,    // 1% (10000)
];

interface PoolLiquidity {
  fee: FeeAmount;
  liquidity: ethers.BigNumber;
  exists: boolean;
}

/**
 * Get liquidity for a specific pool
 */
async function getPoolLiquidity(
  tokenA: Token,
  tokenB: Token,
  fee: FeeAmount
): Promise<PoolLiquidity> {
  try {
    const poolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA,
      tokenB,
      fee,
    });

    const liquidity = await makeProviderRequest(
      tokenA.chainId,
      `pool-liquidity-${poolAddress}`,
      async (provider) => {
        const poolContract = new ethers.Contract(
          poolAddress,
          IUniswapV3PoolABI.abi,
          provider
        );

        try {
          const liquidity = await poolContract.liquidity();
          return liquidity;
        } catch {
          // Pool doesn't exist or has no liquidity
          return ethers.BigNumber.from(0);
        }
      }
    );

    return {
      fee,
      liquidity,
      exists: liquidity.gt(0),
    };
  } catch {
    return {
      fee,
      liquidity: ethers.BigNumber.from(0),
      exists: false,
    };
  }
}

/**
 * Get the best fee tier for a token pair based on liquidity
 */
export async function getBestFeeTier(
  tokenA: Token,
  tokenB: Token
): Promise<FeeAmount> {
  try {
    // Check all fee tiers in parallel
    const liquidityChecks = ALL_FEE_TIERS.map(fee =>
      getPoolLiquidity(tokenA, tokenB, fee)
    );

    const results = await Promise.all(liquidityChecks);
    
    // Filter pools that exist and have liquidity
    const validPools = results.filter(pool => pool.exists);
    
    if (validPools.length === 0) {
      // No pools found, return medium as default
      console.warn(`No pools found for ${tokenA.symbol}/${tokenB.symbol}, using default MEDIUM fee`);
      return FeeAmount.MEDIUM;
    }

    // Sort by liquidity (highest first) and return the fee tier with most liquidity
    const bestPool = validPools.sort((a, b) => 
      b.liquidity.gt(a.liquidity) ? 1 : -1
    )[0];

    console.log(`Best fee tier for ${tokenA.symbol}/${tokenB.symbol}: ${bestPool.fee} (liquidity: ${bestPool.liquidity.toString()})`);
    
    return bestPool.fee;
  } catch (error) {
    console.error("Error finding best fee tier:", error);
    // Fallback to medium fee
    return FeeAmount.MEDIUM;
  }
}

/**
 * Get the best fee tier for common token pairs with predefined logic
 */
export function getOptimalFeeTier(tokenA: Token, tokenB: Token): FeeAmount {
  const symbolA = tokenA.symbol?.toUpperCase();
  const symbolB = tokenB.symbol?.toUpperCase();
  
  // Stablecoin pairs typically use lowest fees
  const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'FRAX'];
  const isStablePair = stablecoins.includes(symbolA || '') && stablecoins.includes(symbolB || '');
  
  if (isStablePair) {
    return FeeAmount.LOWEST; // 0.01%
  }
  
  // ETH/stablecoin pairs often use low fees
  const ethTokens = ['ETH', 'WETH'];
  const isEthStablePair = 
    (ethTokens.includes(symbolA || '') && stablecoins.includes(symbolB || '')) ||
    (stablecoins.includes(symbolA || '') && ethTokens.includes(symbolB || ''));
    
  if (isEthStablePair) {
    return FeeAmount.LOW; // 0.05%
  }
  
  // Most other pairs use medium fees
  return FeeAmount.MEDIUM; // 0.3%
}

/**
 * Get a safe fee tier with fallbacks in case the optimal tier doesn't have a pool
 */
export async function getSafeFeeTier(tokenA: Token, tokenB: Token): Promise<FeeAmount> {
  console.log(`Getting safe fee tier for ${tokenA.symbol} -> ${tokenB.symbol}`);
  
  // Try fee tiers in order of preference with fallbacks
  const fallbackOrder = [
    FeeAmount.MEDIUM,  // 0.3% - most common
    FeeAmount.LOW,     // 0.05% - second most common
    FeeAmount.HIGH,    // 1% - for exotic pairs
    FeeAmount.LOWEST,  // 0.01% - for stables
  ];
  
  for (const feeTier of fallbackOrder) {
    try {
      const poolCheck = await getPoolLiquidity(tokenA, tokenB, feeTier);
      if (poolCheck.exists && poolCheck.liquidity.gt(ethers.utils.parseEther("0.01"))) {
        console.log(`Found working pool with fee tier: ${feeTier} (${feeTier/10000}%)`);
        return feeTier;
      }
    } catch (error) {
      console.log(`Fee tier ${feeTier} failed:`, error);
      continue;
    }
  }
  
  // If no pools found, return medium as last resort
  console.warn(`No pools found for ${tokenA.symbol}-${tokenB.symbol}, using medium fee as fallback`);
  return FeeAmount.MEDIUM;
}

/**
 * Enhanced smart fee tier selection with safety checks
 */
export async function getSmartFeeTier(tokenA: Token, tokenB: Token): Promise<FeeAmount> {
  try {
    // First try the optimal fee tier
    const optimalFee = getOptimalFeeTier(tokenA, tokenB);
    const poolCheck = await getPoolLiquidity(tokenA, tokenB, optimalFee);
    
    if (poolCheck.exists && poolCheck.liquidity.gt(ethers.utils.parseEther("0.01"))) {
      console.log(`Using optimal fee tier: ${optimalFee} (${optimalFee/10000}%) for ${tokenA.symbol}-${tokenB.symbol}`);
      return optimalFee;
    }
    
    // If optimal doesn't work, use safe fallback
    console.log(`Optimal fee tier ${optimalFee} has no liquidity, trying fallbacks...`);
    return await getSafeFeeTier(tokenA, tokenB);
    
  } catch (error) {
    console.error(`Error in smart fee selection for ${tokenA.symbol}-${tokenB.symbol}:`, error);
    return await getSafeFeeTier(tokenA, tokenB);
  }
}

/**
 * Format fee amount for display
 */
export function formatFeeDisplay(fee: FeeAmount): string {
  switch (fee) {
    case FeeAmount.LOWEST:
      return "0.01%";
    case FeeAmount.LOW:
      return "0.05%";
    case FeeAmount.MEDIUM:
      return "0.3%";
    case FeeAmount.HIGH:
      return "1%";
    default:
      return "0.3%"; // fallback
  }
}

/**
 * Get fee description for display
 */
export function getFeeDescription(fee: FeeAmount): string {
  switch (fee) {
    case FeeAmount.LOWEST:
      return "Lowest fee - typically for stablecoin pairs";
    case FeeAmount.LOW:
      return "Low fee - typically for major token pairs";
    case FeeAmount.MEDIUM:
      return "Standard fee - most common";
    case FeeAmount.HIGH:
      return "High fee - for exotic or low-liquidity pairs";
    default:
      return "Standard fee";
  }
}

/**
 * Check if a direct pair should be attempted (skip USDT routing)
 */
export function shouldTryDirectPair(tokenA: Token, tokenB: Token): boolean {
  const symbolA = tokenA.symbol?.toUpperCase();
  const symbolB = tokenB.symbol?.toUpperCase();
  
  // Common pairs that likely have direct pools
  const commonPairs = [
    ['WETH', 'USDT'], ['WETH', 'USDC'], 
    ['ETH', 'USDT'], ['ETH', 'USDC'],
    ['VIRTUAL', 'WETH'], ['SOLACE', 'WETH'],
  ];
  
  return commonPairs.some(([a, b]) => 
    (symbolA === a && symbolB === b) || (symbolA === b && symbolB === a)
  );
}

/**
 * Format fee tier for display
 */
export function formatFeeTier(feeTier: FeeAmount): string {
  return `${feeTier / 10000}%`;
} 