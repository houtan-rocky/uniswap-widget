import { describe, it, expect, vi, beforeEach } from "vitest";
import { ethers } from "ethers";
import type { PoolConfig, TokenInfo } from "../types";

// Mock the trading layer so getQuote's orchestration is tested in isolation.
const { simulateTransaction, getQuotedAmount, getTokenOutDecimals, ctor } =
  vi.hoisted(() => ({
    simulateTransaction: vi.fn(),
    getQuotedAmount: vi.fn(),
    getTokenOutDecimals: vi.fn(),
    ctor: vi.fn(),
  }));

vi.mock("../libs/trading", () => ({
  TokenSwapper: vi.fn().mockImplementation((...args: unknown[]) => {
    ctor(...args);
    return { simulateTransaction, getQuotedAmount, getTokenOutDecimals };
  }),
}));

import { getQuote } from "./quote";

const tokenIn: TokenInfo = {
  chainId: 8453,
  address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
  decimals: 18,
  symbol: "VIRTUAL",
  name: "Virtual Protocol",
  logoURI: "",
};
const tokenOut: TokenInfo = {
  chainId: 8453,
  address: "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  decimals: 6,
  symbol: "SOLACE",
  name: "Solace",
  logoURI: "",
};
const poolConfig: PoolConfig = {
  tokenIn,
  tokenOut,
  poolAddress: "0x912567c105A172777e56411DD0AA4Acc10e628a9",
  version: "V2",
};
const signer = {} as ethers.Signer;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getQuote", () => {
  it("returns the formatted output amount and direct route info", async () => {
    simulateTransaction.mockResolvedValue("Ok");
    getQuotedAmount.mockResolvedValue(ethers.BigNumber.from("2500000")); // 2.5 @ 6dp
    getTokenOutDecimals.mockResolvedValue(6);

    const result = await getQuote({
      signer,
      inputToken: tokenIn,
      outputToken: tokenOut,
      inputAmount: "1",
      poolConfig,
    });

    expect(result.outputAmount).toBe("2.5");
    expect(result.routeInfo).toEqual({
      isDirectRoute: true,
      routeString: "Direct via VIRTUAL/SOLACE Pool",
      routeType: "V2",
    });
    // TokenSwapper built with the right token addresses + signer
    expect(ctor).toHaveBeenCalledWith(
      tokenIn.address,
      tokenOut.address,
      undefined,
      signer
    );
  });

  it("throws when the simulation does not return Ok", async () => {
    simulateTransaction.mockResolvedValue("Insufficient liquidity");
    await expect(
      getQuote({
        signer,
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        poolConfig,
      })
    ).rejects.toThrow("Quote simulation failed: Insufficient liquidity");
    expect(getQuotedAmount).not.toHaveBeenCalled();
  });

  it("bails out (without quoting) when the signal is already aborted", async () => {
    simulateTransaction.mockResolvedValue("Ok");
    const controller = new AbortController();
    controller.abort();

    await expect(
      getQuote({
        signer,
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        poolConfig,
        signal: controller.signal,
      })
    ).rejects.toThrow();
    expect(getQuotedAmount).not.toHaveBeenCalled();
  });
});
