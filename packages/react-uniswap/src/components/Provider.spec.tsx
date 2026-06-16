import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import type { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { Provider } from "./Provider";
import type { WalletAdapter } from "../wallet/types";

// WagmiProvider needs a live wagmi Config; stub it to a passthrough.
vi.mock("wagmi", () => ({
  WagmiProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const fakeAdapter = { wagmiConfig: {} } as unknown as WagmiAdapter;
// A stub wallet adapter so the Provider doesn't reach for Reown/AppKit in tests.
const stubWalletAdapter: WalletAdapter = () => ({
  isConnected: false,
  connect: () => {},
});

describe("<Provider>", () => {
  it("renders children through the wagmi + query providers", () => {
    render(
      <Provider wagmiAdapter={fakeAdapter} walletAdapter={stubWalletAdapter}>
        <span>hello widget</span>
      </Provider>,
    );
    expect(screen.getByText("hello widget")).toBeInTheDocument();
  });

  it("accepts a custom queryClient", () => {
    const queryClient = new QueryClient();
    render(
      <Provider
        wagmiAdapter={fakeAdapter}
        queryClient={queryClient}
        walletAdapter={stubWalletAdapter}
      >
        <span>custom client</span>
      </Provider>,
    );
    expect(screen.getByText("custom client")).toBeInTheDocument();
  });
});
