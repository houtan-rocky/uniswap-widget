import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import { WalletAdapterProvider, useWallet } from "./context";
import type { WalletAdapter } from "./types";

describe("wallet adapter plugin", () => {
  it("useWallet throws when used outside a wallet provider", () => {
    // Suppress React's expected error log for the throwing render.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useWallet())).toThrow(/wallet provider/i);
    spy.mockRestore();
  });

  it("exposes a custom adapter's connection via useWallet", () => {
    const adapter: WalletAdapter = () => ({
      isConnected: true,
      address: "0xabc0000000000000000000000000000000000def",
      connect: () => {},
    });

    function Probe() {
      const { isConnected, address } = useWallet();
      return <div>{isConnected ? `connected:${address}` : "disconnected"}</div>;
    }

    render(
      <WalletAdapterProvider adapter={adapter}>
        <Probe />
      </WalletAdapterProvider>,
    );

    expect(screen.getByText(/connected:0xabc/)).toBeInTheDocument();
  });
});
