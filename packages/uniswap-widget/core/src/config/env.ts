// Environment configuration with fallback defaults
export const config = {
  // WalletConnect/AppKit Configuration
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID || 'a76ff31b5428ab5acc3b017e142d6365',
  
  // App Metadata
  appName: import.meta.env.VITE_APP_NAME || 'Uniswap Widget Package',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Clean Uniswap swap widget for easy integration',
  appUrl: import.meta.env.VITE_APP_URL || 'https://your-domain.com',
  appIcon: import.meta.env.VITE_APP_ICON || 'https://avatars.githubusercontent.com/u/179229932',
};

export default config; 