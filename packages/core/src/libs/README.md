# Base Chain Provider System

This directory contains the Base chain provider implementation that enables transactions on the Base network.

## Supported Network

| Chain ID | Network | RPC Endpoint | Native Currency |
|----------|---------|--------------|-----------------|
| 8453 | Base | https://base.llamarpc.com | ETH |

## Usage

### Basic Provider Access

```typescript
import { getProvider } from './provider';

// Get provider for Base chain
const baseProvider = getProvider();

// Any chain ID will return Base provider with warning
const provider = getProvider(8453); // Recommended
const providerAnyChain = getProvider(1); // Will use Base with warning
```

### Multi-Chain Operations (Returns Base for all)

```typescript
import { getMultiChainProviders, getSupportedChainIds } from './provider';

// Get Base provider for multiple requests
const chainIds = [8453]; 
const providers = getMultiChainProviders(chainIds);

// Get supported chain IDs (only Base)
const supportedChains = getSupportedChainIds(); // [8453]
```

### Chain Configuration

```typescript
import { getChainConfig, isSupportedChain } from './provider';

// Check if chain is supported (only Base is supported)
if (isSupportedChain(8453)) {
  const config = getChainConfig(8453);
  console.log(`Network: ${config.name}`); // "Base"
  console.log(`Native Currency: ${config.nativeCurrency.symbol}`); // "ETH"
}
```

## Features

- **Base Chain Focus**: Optimized specifically for Base network
- **Provider Caching**: Automatically caches providers to avoid creating multiple instances
- **Fallback Warning**: Warns when non-Base chains are requested
- **Rate Limiting**: Conservative rate limiting optimized for Base chain
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Graceful error handling with informative warnings

## Integration

The Base chain provider system is integrated into:

- **Balance Fetching**: `useBalances` hook uses Base provider
- **Pool Information**: `getPoolInfo` function uses Base provider
- **Token Search**: Searches only Base chain tokens
- **Transaction Execution**: Transactions use Base provider

## Rate Limiting

Base chain specific rate limiting:
- **Throttle Limit**: 3 concurrent requests
- **Request Interval**: 2 seconds minimum between requests
- **Cache Duration**: 10 seconds for response caching
- **Debounce Timings**: 
  - Balance fetching: 300ms
  - Quote requests: 500ms
  - Token search: 300ms

## Configuration

All configuration is optimized for Base chain:

```typescript
const BASE_CHAIN_CONFIG = {
  chainId: 8453,
  name: "Base",
  rpcUrl: "https://base.llamarpc.com",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
};
```

This ensures reliable and efficient interaction with the Base network while maintaining optimal performance and avoiding rate limits. 