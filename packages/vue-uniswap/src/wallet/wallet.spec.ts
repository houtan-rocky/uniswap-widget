import { describe, it, expect, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";
import WalletAdapterProvider from "./WalletAdapterProvider.vue";
import { useWallet } from "./context";
import type { WalletAdapter } from "./types";

describe("wallet adapter plugin (vue)", () => {
  it("useWallet throws when used outside a wallet provider", () => {
    const Probe = defineComponent({
      setup() {
        useWallet();
        return () => h("div");
      },
    });
    expect(() => mount(Probe)).toThrow(/must be used inside/i);
  });

  it("exposes a custom adapter's connection via useWallet", () => {
    const adapter: WalletAdapter = () => ({
      isConnected: ref(true),
      address: ref("0xabc0000000000000000000000000000000000def"),
      getSigner: vi.fn(),
      connect: vi.fn(),
    });

    const Probe = defineComponent({
      setup() {
        const { isConnected, address } = useWallet();
        return () =>
          h("div", isConnected.value ? `connected:${address.value}` : "off");
      },
    });

    const wrapper = mount(WalletAdapterProvider, {
      props: { adapter },
      slots: { default: () => h(Probe) },
    });

    expect(wrapper.text()).toContain("connected:0xabc");
  });
});
