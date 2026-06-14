import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchTokens, convertSearchTokenToInfo } from "./search";
import type { UniswapSearchTokenResponse } from "../types";

const apiToken: UniswapSearchTokenResponse = {
  tokenId: "8453_0xabc",
  chainId: 8453,
  address: "0xabc",
  decimals: 18,
  symbol: "FOO",
  name: "Foo Token",
  standard: "ERC20",
  projectName: "Foo",
  logoUrl: "https://logo/foo.png",
  isSpam: "FALSE",
  safetyLevel: "VERIFIED",
  feeData: { sellFeeBps: "0", buyFeeBps: "0" },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0xabc",
    chainId: 8453,
    address: "0xabc",
    blockaidFees: { buy: 0, sell: 0 },
    updatedAt: 0,
  },
};

describe("convertSearchTokenToInfo", () => {
  it("maps an API token into TokenInfo", () => {
    const info = convertSearchTokenToInfo(apiToken);
    expect(info.symbol).toBe("FOO");
    expect(info.decimals).toBe(18);
    expect(info.chainId).toBe(8453);
    // logoUrl is surfaced as logoURI
    expect(info.logoURI).toBe("https://logo/foo.png");
  });

  it("falls back to empty logoURI when logoUrl is missing", () => {
    const info = convertSearchTokenToInfo({ ...apiToken, logoUrl: undefined });
    expect(info.logoURI).toBe("");
  });
});

describe("searchTokens", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns [] for a blank query without hitting the network", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(searchTokens("   ")).resolves.toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("POSTs the query and maps the returned tokens", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ tokens: [apiToken] }) });
    vi.stubGlobal("fetch", fetchSpy);

    const results = await searchTokens("foo", { chainIds: [8453] });

    expect(results).toHaveLength(1);
    expect(results[0].symbol).toBe("FOO");

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toContain("/api/uniswap/v2/Search.v1.SearchService/SearchTokens");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.searchQuery).toBe("foo");
    expect(body.chainIds).toEqual([8453]);
  });

  it("uses a custom endpoint when provided", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ tokens: [] }) });
    vi.stubGlobal("fetch", fetchSpy);

    await searchTokens("foo", { endpoint: "/custom/search" });
    expect(fetchSpy.mock.calls[0][0]).toBe("/custom/search");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(searchTokens("foo")).rejects.toThrow("Search failed: 503");
  });

  it("tolerates a response with no tokens array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    await expect(searchTokens("foo")).resolves.toEqual([]);
  });
});
