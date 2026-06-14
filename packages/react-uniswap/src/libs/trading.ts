/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { PoolConfig } from "../types";
import { toChecksumAddress } from "../utils/addresses";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const V2_ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function factory() external pure returns (address)",
];

const V2_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

const V2_PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
];

interface SwapResult {
  amountIn: string;
  totalAmountOut: string;
  userAmount: string;
  portionAmount: string;
  error?: string;
}

export class TokenSwapper {
  private provider: ethers.providers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private router: ethers.Contract | null = null;
  private tokenIn: ethers.Contract | null = null;
  private tokenOut: ethers.Contract | null = null;
  private tokenInAddress: string;
  private tokenOutAddress: string;
  private poolConfig: PoolConfig | null = null;
  private routerAddress?: string;

  constructor(
    tokenInAddressOrConfig: string | PoolConfig,
    tokenOutAddress?: string,
    routerAddress?: string,
    signer?: ethers.Signer
  ) {
    if (typeof tokenInAddressOrConfig === "string" && tokenOutAddress) {
      this.tokenInAddress = toChecksumAddress(tokenInAddressOrConfig);
      this.tokenOutAddress = toChecksumAddress(tokenOutAddress);
    } else if (typeof tokenInAddressOrConfig === "object") {
      const config = tokenInAddressOrConfig as PoolConfig;
      this.tokenInAddress = toChecksumAddress(config.tokenIn.address);
      this.tokenOutAddress = toChecksumAddress(config.tokenOut.address);
      this.poolConfig = config;
    } else {
      throw new Error("Invalid constructor arguments");
    }

    this.routerAddress = routerAddress
      ? toChecksumAddress(routerAddress)
      : undefined;

    this.signer = signer || null;
  }

  private async initialize() {
    if (!this.signer) {
      throw new Error("Signer not provided");
    }

    const provider = this.signer.provider;
    if (!provider) {
      throw new Error("Provider not found");
    }
    this.provider = provider;

    if (!this.router) {
      this.router = new ethers.Contract(
        this.routerAddress || "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
        V2_ROUTER_ABI,
        this.signer
      );

      this.tokenIn = new ethers.Contract(
        this.tokenInAddress,
        ERC20_ABI,
        this.signer
      );
      this.tokenOut = new ethers.Contract(
        this.tokenOutAddress,
        ERC20_ABI,
        this.signer
      );
    }
  }

  private async checkPool(): Promise<{
    exists: boolean;
    pairAddress: string;
    reserves?: { reserve0: ethers.BigNumber; reserve1: ethers.BigNumber };
  }> {
    if (!this.provider || !this.router) throw new Error("Not initialized");

    try {
      const pairAddress = this.poolConfig?.poolAddress || "";
      console.log("Initial pool address:", pairAddress);

      let finalPairAddress = pairAddress;
      if (!pairAddress || pairAddress === ethers.constants.AddressZero) {
        console.log("No pool address provided, checking factory");
        const factoryAddress = await this.router.factory();
        console.log("Factory address:", factoryAddress);

        const factory = new ethers.Contract(
          factoryAddress,
          V2_FACTORY_ABI,
          this.provider
        );
        const factoryPairAddress = await factory.getPair(
          this.tokenInAddress,
          this.tokenOutAddress
        );
        console.log("Factory pair lookup result:", factoryPairAddress);

        if (factoryPairAddress === ethers.constants.AddressZero) {
          console.log("Factory returned zero address");
          return { exists: false, pairAddress: factoryPairAddress };
        }
        finalPairAddress = factoryPairAddress;
      }

      console.log("Using pair address:", finalPairAddress);
      const pair = new ethers.Contract(
        finalPairAddress,
        V2_PAIR_ABI,
        this.provider
      );

      try {
        console.log("Getting reserves and tokens...");
        const [reserve0, reserve1] = await pair.getReserves();
        const token0 = await pair.token0();
        const token1 = await pair.token1();

        console.log("Pool tokens:", {
          token0: token0.toLowerCase(),
          token1: token1.toLowerCase(),
          expectedToken0: this.tokenInAddress.toLowerCase(),
          expectedToken1: this.tokenOutAddress.toLowerCase(),
        });

        const poolTokens = new Set([
          token0.toLowerCase(),
          token1.toLowerCase(),
        ]);
        const expectedTokens = new Set([
          this.tokenInAddress.toLowerCase(),
          this.tokenOutAddress.toLowerCase(),
        ]);

        const tokensMatch = Array.from(poolTokens).every((t) =>
          expectedTokens.has(t)
        );
        console.log("Tokens match:", tokensMatch);

        if (!tokensMatch) {
          console.log("Token mismatch in pool");
          return { exists: false, pairAddress: finalPairAddress };
        }

        const reserves =
          token0.toLowerCase() === this.tokenInAddress.toLowerCase()
            ? { reserve0, reserve1 }
            : { reserve0: reserve1, reserve1: reserve0 };

        console.log("Pool reserves:", {
          reserve0: ethers.utils.formatEther(reserves.reserve0),
          reserve1: ethers.utils.formatEther(reserves.reserve1),
        });

        return { exists: true, pairAddress: finalPairAddress, reserves };
      } catch (error) {
        console.error("Pool check error:", {
          error,
          pairAddress: finalPairAddress,
          tokenIn: this.tokenInAddress,
          tokenOut: this.tokenOutAddress,
        });
        return { exists: false, pairAddress: finalPairAddress };
      }
    } catch (error) {
      console.error("Pool lookup error:", {
        error,
        tokenIn: this.tokenInAddress,
        tokenOut: this.tokenOutAddress,
      });
      return { exists: false, pairAddress: ethers.constants.AddressZero };
    }
  }

  async getQuote(amountIn: string, portionBips = 0): Promise<SwapResult> {
    await this.initialize();

    try {
      if (!this.signer || !this.router) {
        throw new Error("Not initialized");
      }

      let amountInWei: ethers.BigNumber;
      try {
        amountInWei = ethers.BigNumber.from(amountIn);
        if (amountInWei.isZero()) {
          throw new Error("Amount must be positive");
        }
      } catch {
        if (
          !/^\d*\.?\d*$/.test(amountIn) ||
          isNaN(Number(amountIn)) ||
          Number(amountIn) === 0
        ) {
          throw new Error("Invalid amount");
        }
        const decimals = await this.tokenIn!.decimals();
        amountInWei = ethers.utils.parseUnits(amountIn, decimals);
      }

      const poolInfo = await this.checkPool();
      if (!poolInfo.exists || !poolInfo.reserves) {
        throw new Error("Pool validation failed");
      }

      const path = [this.tokenInAddress, this.tokenOutAddress];
      const amounts = await this.router.callStatic.getAmountsOut(
        amountInWei,
        path
      );

      const amountOut = amounts[1];
      const portionAmount =
        portionBips > 0
          ? amountOut.mul(portionBips).div(10000)
          : ethers.constants.Zero;
      const userAmount = amountOut.sub(portionAmount);

      if (userAmount.isZero()) {
        throw new Error("Zero output amount");
      }

      return {
        amountIn: ethers.utils.formatEther(amounts[0]),
        totalAmountOut: ethers.utils.formatEther(amountOut),
        userAmount: ethers.utils.formatEther(userAmount),
        portionAmount: ethers.utils.formatEther(portionAmount),
      };
    } catch (error: any) {
      return {
        amountIn: "0",
        totalAmountOut: "0",
        userAmount: "0",
        portionAmount: "0",
        error: error.message || "Failed to get quote",
      };
    }
  }

  async executeSwap(
    amountIn: string | ethers.BigNumber,
    minAmountOut: string | ethers.BigNumber,
    recipient: string,
    deadline = Math.floor(Date.now() / 1000) + 1200 // 20 minutes
  ): Promise<string> {
    await this.initialize();
    if (!this.signer) throw new Error("Not initialized");

    const amountInWei =
      typeof amountIn === "string"
        ? ethers.utils.parseEther(amountIn)
        : amountIn;

    const minAmountOutWei =
      typeof minAmountOut === "string"
        ? ethers.utils.parseEther(minAmountOut)
        : minAmountOut;

    const allowance = await this.tokenIn!.allowance(
      await this.signer.getAddress(),
      this.router!.address
    );

    if (allowance.lt(amountInWei)) {
      const tx = await this.tokenIn!.approve(
        this.router!.address,
        ethers.constants.MaxUint256
      );
      await tx.wait();
    }

    const path = [this.tokenInAddress, this.tokenOutAddress];
    const tx = await this.router!.swapExactTokensForTokens(
      amountInWei,
      minAmountOutWei,
      path,
      recipient,
      deadline,
      { gasLimit: 300000 }
    );

    return tx.hash;
  }

  // Backward compatibility method
  async simulateTransaction(amountIn: string): Promise<string> {
    try {
      const quote = await this.getQuote(amountIn);
      if (quote.error) {
        return quote.error;
      }
      return "Ok";
    } catch (error: any) {
      return error.message || "Failed to simulate transaction";
    }
  }

  async getTokenInBalance(): Promise<string> {
    await this.initialize();
    const balance = await this.tokenIn!.balanceOf(
      await this.signer!.getAddress()
    );
    const decimals = await this.tokenIn!.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  async getTokenOutBalance(): Promise<string> {
    await this.initialize();
    const balance = await this.tokenOut!.balanceOf(
      await this.signer!.getAddress()
    );
    const decimals = await this.tokenOut!.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  async getSignerAddress(): Promise<string> {
    await this.initialize();
    if (!this.signer) throw new Error("Signer not initialized");
    return this.signer.getAddress();
  }

  async getTokenInSymbol(): Promise<string> {
    await this.initialize();
    if (!this.tokenIn) throw new Error("Token not initialized");
    return this.tokenIn.symbol();
  }

  async getTokenOutDecimals(): Promise<number> {
    await this.initialize();
    if (!this.tokenOut) throw new Error("Token not initialized");
    return this.tokenOut.decimals();
  }

  getRouterAddress(): string {
    return this.routerAddress || "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";
  }

  // Add a method specifically for getting quote amounts
  async getQuotedAmount(amountIn: string): Promise<ethers.BigNumber> {
    await this.initialize();
    if (!this.router) throw new Error("Not initialized");

    const amountInWei = ethers.BigNumber.from(amountIn);
    const path = [this.tokenInAddress, this.tokenOutAddress];

    const amounts = await this.router.getAmountsOut(amountInWei, path);

    return amounts[1];
  }
}
