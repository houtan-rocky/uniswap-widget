import { AppConfig } from "../types";
import { 
  SolaceTokenInfo, 
  VirtualProtocolTokenInfo, 
  VDNTTokenInfo,
  WETHTokenInfo,
  USDCTokenInfo
} from "../constants";

/**
 * App Configuration
 * 
 * Environment Variables:
 * - VITE_ALLOW_SELL_TOKEN_CHANGE: Set to 'false' to disable sell token selection (default: true)
 * - VITE_ALLOW_BUY_TOKEN_CHANGE: Set to 'false' to disable buy token selection (default: true)
 * 
 * Example .env file:
 * VITE_ALLOW_SELL_TOKEN_CHANGE=false
 * VITE_ALLOW_BUY_TOKEN_CHANGE=true
 */

// Environment variables (can be overridden via process.env in production)
const ALLOW_SELL_TOKEN_CHANGE = import.meta.env.VITE_ALLOW_SELL_TOKEN_CHANGE !== 'false';
const ALLOW_BUY_TOKEN_CHANGE = import.meta.env.VITE_ALLOW_BUY_TOKEN_CHANGE !== 'false';

export const appConfig: AppConfig = {
  // Control whether users can change sell/buy tokens
  allowSellTokenChange: ALLOW_SELL_TOKEN_CHANGE,
  allowBuyTokenChange: ALLOW_BUY_TOKEN_CHANGE,

  // Available tokens for selling
  sellTokens: [
    SolaceTokenInfo,
    VirtualProtocolTokenInfo,
    VDNTTokenInfo,
    WETHTokenInfo,
    USDCTokenInfo,
  ],

  // Available tokens for buying  
  buyTokens: [
    SolaceTokenInfo,
    VirtualProtocolTokenInfo,
    VDNTTokenInfo,
    WETHTokenInfo,
    USDCTokenInfo,
  ],
};

// Helper functions to get specific token lists
export const getSellTokens = () => appConfig.sellTokens;
export const getBuyTokens = () => appConfig.buyTokens;
export const canChangeSellToken = () => appConfig.allowSellTokenChange;
export const canChangeBuyToken = () => appConfig.allowBuyTokenChange; 