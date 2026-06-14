import { Token } from "@uniswap/sdk-core";

// Verified Base chain tokens only
export const WETH_TOKEN = new Token(
  8453,
  "0x4200000000000000000000000000000000000006",
  18,
  "WETH",
  "Wrapped Ether"
);

export const USDT_TOKEN = new Token(
  8453,
  "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  6,
  "USDT",
  "Tether USD"
);

export const CBETH_TOKEN = new Token(
  8453,
  "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
  18,
  "cbETH",
  "Coinbase Wrapped Staked ETH"
);

export const CBBTC_TOKEN = new Token(
  8453,
  "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
  8,
  "cbBTC",
  "Coinbase Wrapped BTC"
);

export const SOLACE_TOKEN = new Token(
  8453,
  "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  18,
  "SOLACE",
  "Solace by Virtuals"
);

export const VIRTUAL_TOKEN = new Token(
  8453,
  "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  18,
  "VIRTUAL",
  "Virtual Protocol"
);

export const VDNT_TOKEN = new Token(
  8453,
  "0x623435eadf56a7f66726756b1b1a531349ee36a1",
  18,
  "VDNT",
  "Verdant"
);

export const USDC_TOKEN = new Token(
  8453,
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  6,
  "USDC",
  "USD Coin"
);

// Backward compatibility aliases
export const VIRTUAL_PROTOCOL_TOKEN = VIRTUAL_TOKEN;

// Uniswap V3 contracts on Base
export const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";
export const QUOTER_CONTRACT_ADDRESS =
  "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";
export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";

// Uniswap V2 contracts on Base
export const UNISWAP_V2_FACTORY_ADDRESS =
  "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6";
export const UNISWAP_V2_ROUTER_ADDRESS =
  "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";

export const DEFAULT_SLIPPAGE = 0.5;
export const DEFAULT_DEADLINE_MINUTES = 20;

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
];

// Uniswap V2 Router ABI
export const UNISWAP_V2_ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function factory() external pure returns (address)",
];

// Uniswap V2 Factory ABI
export const UNISWAP_V2_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

// Uniswap V2 Pair ABI
export const UNISWAP_V2_PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
];

// TokenInfo interface for search functionality
interface TokenInfo {
  tokenId: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  standard: string;
  projectName: string;
  logoUrl: string;
  isSpam: string;
  safetyLevel: string;
  feeData: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: { buy?: number; sell?: number } | null;
    updatedAt: number;
  };
  logoURI: string;
}

// Verified TokenInfo objects
export const VirtualProtocolTokenInfo: TokenInfo = {
  tokenId: "8453_0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  chainId: 8453,
  address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  decimals: 18,
  symbol: "VIRTUAL",
  name: "Virtual Protocol",
  standard: "ERC20",
  projectName: "Virtuals Protocol",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/34057/large/LOGOMARK.png?1708356054",
  isSpam: "FALSE",
  safetyLevel: "STRONG_WARNING",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    chainId: 8453,
    address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    blockaidFees: null,
    updatedAt: 1748582268,
  },
  logoURI:
    "https://assets.coingecko.com/coins/images/33154/standard/256x256_mark.png",
};

export const SolaceTokenInfo: TokenInfo = {
  tokenId: "8453_0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  chainId: 8453,
  address: "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  decimals: 18,
  symbol: "SOLACE",
  name: "Solace by Virtuals",
  standard: "ERC20",
  projectName: "Solace",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/66174/large/solace_logo.jpg?1748565484",
  isSpam: "FALSE",
  safetyLevel: "STRONG_WARNING",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x7d6fcb3327d7e17095fa8b0e3513ac7a3564f5e1",
    chainId: 8453,
    address: "0x7d6fcb3327d7e17095fa8b0e3513ac7a3564f5e1",
    blockaidFees: {
      buy: 0.01,
      sell: 0.01,
    },
    updatedAt: 1748577080,
  },
  logoURI:
    "https://assets.coingecko.com/coins/images/32849/standard/solace_logo_256.png",
};

export const VDNTTokenInfo: TokenInfo = {
  tokenId: "8453_0x623435eadf56a7f66726756b1b1a531349ee36a1",
  chainId: 8453,
  address: "0x623435eadf56a7f66726756b1b1a531349ee36a1",
  decimals: 18,
  symbol: "VDNT",
  name: "Verdant",
  standard: "ERC20",
  projectName: "Verdant",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/34057/large/LOGOMARK.png?1708356054",
  isSpam: "FALSE",
  safetyLevel: "STRONG_WARNING",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x623435eadf56a7f66726756b1b1a531349ee36a1",
    chainId: 8453,
    address: "0x623435eadf56a7f66726756b1b1a531349ee36a1",
    blockaidFees: null,
    updatedAt: 1748582268,
  },
  logoURI:
    "https://assets.coingecko.com/coins/images/33155/standard/256x256_mark.png",
};

export const WETHTokenInfo: TokenInfo = {
  tokenId: "8453_0x4200000000000000000000000000000000000006",
  chainId: 8453,
  address: "0x4200000000000000000000000000000000000006",
  decimals: 18,
  symbol: "WETH",
  name: "Wrapped Ether",
  standard: "ERC20",
  projectName: "Wrapped Ether",
  logoUrl: "https://coin-images.coingecko.com/coins/images/2518/large/weth.png",
  isSpam: "FALSE",
  safetyLevel: "VERIFIED",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x4200000000000000000000000000000000000006",
    chainId: 8453,
    address: "0x4200000000000000000000000000000000000006",
    blockaidFees: null,
    updatedAt: 1748582268,
  },
  logoURI: "https://assets.coingecko.com/coins/images/2518/standard/weth.png",
};

export const USDCTokenInfo: TokenInfo = {
  tokenId: "8453_0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chainId: 8453,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
  symbol: "USDC",
  name: "USD Coin",
  standard: "ERC20",
  projectName: "USD Coin",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  isSpam: "FALSE",
  safetyLevel: "VERIFIED",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    chainId: 8453,
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    blockaidFees: null,
    updatedAt: 1748582268,
  },
  logoURI:
    "https://assets.coingecko.com/coins/images/6319/standard/USD_Coin_icon.png",
};

// Backward compatibility aliases
export const VritualProtocolTokenInfo = VirtualProtocolTokenInfo;

// Additional token types export for compatibility
export type { TokenInfo };
