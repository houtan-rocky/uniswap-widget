import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";

// Keep the real core values (DEFAULT_POOL_CONFIG, lightTheme) but stub the
// network-touching functions.
vi.mock("@uniswap-widget/core", async (importActual) => {
  const actual = await importActual<typeof import("@uniswap-widget/core")>();
  return { ...actual, getQuote: vi.fn(), executeSwap: vi.fn() };
});

import SwapWidget from "./SwapWidget.vue";
import { WALLET_KEY } from "../wallet/context";
import type { WalletConnection } from "../wallet/types";

function mountWidget(connect = vi.fn()) {
  const connection: WalletConnection = {
    isConnected: ref(false),
    address: ref(undefined),
    getSigner: vi.fn().mockResolvedValue(undefined),
    connect,
  };
  return mount(SwapWidget, {
    global: {
      provide: { [WALLET_KEY as symbol]: connection },
    },
  });
}

describe("SwapWidget.vue", () => {
  it("renders the default token pair and a Connect Wallet button when disconnected", () => {
    const wrapper = mountWidget();
    const text = wrapper.text();
    expect(text).toContain("VIRTUAL");
    expect(text).toContain("SOLACE");
    expect(text).toContain("Connect Wallet");
  });

  it("calls the adapter's connect() when Connect Wallet is clicked", async () => {
    const connect = vi.fn();
    const wrapper = mountWidget(connect);
    await wrapper.get("button").trigger("click");
    expect(connect).toHaveBeenCalled();
  });

  it("disables the sell input while disconnected", () => {
    const wrapper = mountWidget();
    const input = wrapper.get('input[inputmode="decimal"]');
    expect((input.element as HTMLInputElement).disabled).toBe(true);
  });
});
