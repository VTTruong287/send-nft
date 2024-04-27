export type Network = {
  name: string;
  chainId: number;
  chainIdHex: string;
  nativeCoin: string;
  RPCs: string[];
}

export const ARB: Network = {
  name: "Arbitrum One",
  chainId: 42161,
  chainIdHex: "0xa4b1",
  nativeCoin: "ETH",
  RPCs: [
    "wss://arbitrum-one.publicnode.com",
    "https://arb1.arbitrum.io/rpc",
    "https://1rpc.io/arb",
    "https://public.stackup.sh/api/v1/node/arbitrum-one",
    "https://arb-mainnet-public.unifra.io",
    "https://arbitrum-one.publicnode.com",
    "https://arbitrum-one-rpc.publicnode.com",
    "https://arbitrum-mainnet.infura.io",
  ],
};

export const SepoliaARB: Network = {
  name: "Sepolia ARB",
  chainId: 421614,
  chainIdHex: "0x66eee",
  nativeCoin: "SepoliaETH",
  RPCs: [
    "https://public.stackup.sh/api/v1/node/arbitrum-sepolia",
    "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
    "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
    "https://sepolia-rollup.arbitrum.io/rpc"
  ],
}

export const SepoliaETH: Network = {
  name: "Sepolia ETH",
  chainId: 11155111,
  chainIdHex: "0xaa36a7",
  nativeCoin: "SepoliaETH",
  RPCs: [
    "https://sepolia.drpc.org",
    "https://rpc.sepolia.org",
    "wss://sepolia.drpc.org"
  ],
}
