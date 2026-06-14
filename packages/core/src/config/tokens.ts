import { TokenInfo, PoolConfig } from "../types";
import { toChecksumAddress } from "../utils/addresses";

// Constants for addresses
const VIRTUAL_TOKEN_ADDRESS = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22";

// Default Virtual Protocol token that will typically be used as the input token
export const VIRTUAL_PROTOCOL_TOKEN: TokenInfo = {
  chainId: 8453,
  address: toChecksumAddress(VIRTUAL_TOKEN_ADDRESS),
  decimals: 18,
  symbol: "VIRTUAL",
  name: "Virtual Protocol",
  logoURI:
    "https://assets.coingecko.com/coins/images/33154/standard/256x256_mark.png",
};

// Default configuration - tokenOut can be changed as needed
export const DEFAULT_POOL_CONFIG: PoolConfig = {
  tokenIn: {
    address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    symbol: "VIRTUAL",
    name: "VIRTUAL Protocol Token",
    decimals: 18,
    chainId: 8453,
    logoURI: "https://assets.coingecko.com/coins/images/33154/standard/256x256_mark.png"
  },
  tokenOut: {
    address: "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
    symbol: "SOLACE",
    name: "Solace by Virtuals",
    decimals: 18,
    chainId: 8453,
    logoURI: "https://assets.coingecko.com/coins/images/32849/standard/solace_logo_256.png"
  },
  poolAddress: "0x912567c105A172777e56411DD0AA4Acc10e628a9",
  version: "V2"
};

// Example usage:
// const myConfig: PoolConfig = {
//   tokenIn: VIRTUAL_PROTOCOL_TOKEN, // Using default VIRTUAL token
//   tokenOut: {
//     // Your custom output token configuration
//   },
//   poolAddress: "your-pool-address"
// };
