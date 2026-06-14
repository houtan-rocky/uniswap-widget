import { describe, it, expect, vi, beforeEach } from "vitest";
import { ethers } from "ethers";
import type { TokenInfo } from "../types";

const { getSignerAddress, executeSwapMethod, ctor } = vi.hoisted(() => ({
  getSignerAddress: vi.fn(),
  executeSwapMethod: vi.fn(),
  ctor: vi.fn(),
}));

vi.mock("../libs/trading", () => ({
  TokenSwapper: vi.fn().mockImplementation((...args: unknown[]) => {
    ctor(...args);
    return { getSignerAddress, executeSwap: executeSwapMethod };
  }),
}));

import { executeSwap } from "./execute";

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
  decimals: 18,
  symbol: "SOLACE",
  name: "Solace",
  logoURI: "",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("executeSwap", () => {
  it("sends the swap, waits for the tx, fires onSwap, and returns the hash", async () => {
    const waitForTransaction = vi.fn().mockResolvedValue({});
    const signer = { provider: { waitForTransaction } } as unknown as ethers.Signer;
    getSignerAddress.mockResolvedValue("0xUser");
    executeSwapMethod.mockResolvedValue("0xhash");
    const onSwap = vi.fn();

    const hash = await executeSwap({
      signer,
      inputToken: tokenIn,
      outputToken: tokenOut,
      inputAmount: "1",
      outputAmount: "2",
      onSwap,
    });

    expect(hash).toBe("0xhash");
    expect(executeSwapMethod).toHaveBeenCalledWith("1", "2", "0xUser");
    expect(waitForTransaction).toHaveBeenCalledWith("0xhash");
    expect(onSwap).toHaveBeenCalledWith("1", "2");
  });

  it("throws when the signer has no provider", async () => {
    const signer = { provider: null } as unknown as ethers.Signer;
    getSignerAddress.mockResolvedValue("0xUser");
    executeSwapMethod.mockResolvedValue("0xhash");

    await expect(
      executeSwap({
        signer,
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        outputAmount: "2",
      })
    ).rejects.toThrow("Provider not found");
  });

  it("works without an onSwap callback", async () => {
    const waitForTransaction = vi.fn().mockResolvedValue({});
    const signer = { provider: { waitForTransaction } } as unknown as ethers.Signer;
    getSignerAddress.mockResolvedValue("0xUser");
    executeSwapMethod.mockResolvedValue("0xhash");

    await expect(
      executeSwap({
        signer,
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        outputAmount: "2",
      })
    ).resolves.toBe("0xhash");
  });
});
