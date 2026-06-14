import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { POOL_FACTORY_CONTRACT_ADDRESS } from "../constants";
import { makeProviderRequest } from "./provider";

interface PoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: ethers.BigNumber;
  liquidity: ethers.BigNumber;
  tick: number;
}

export async function getPoolInfo(
  tokenIn: Token,
  tokenOut: Token
): Promise<PoolInfo> {
  // Use the chain ID from the tokens (assuming both tokens are on the same chain)
  const chainId = tokenIn.chainId;

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: FeeAmount.MEDIUM,
  });

  // Use rate-limited provider request
  return makeProviderRequest(
    chainId,
    `pool-info-${currentPoolAddress}`,
    async (provider) => {
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );
      
  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
    }
  );
}
