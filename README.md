# Cosmos Wallet Wires

This is a simple approach for a very simple use-case, grab the cosmos wallet address from the user. The whole idea
with this implementation is to combine all the libs and glues in a single place so developers can just use it without
having to worry about the EVM details and other blockchains implementations.

I'm hoping to work on it further and make it actually sign messages and broadcast them.

## How to use

```js
import { WalletConnector } from 'cosmos-wallet-wires';

// Connecting KEPLR
const connector = new WalletConnector(
    new KeplrWallet(window.keplr, window.getOfflineSigner)
);
const address = await connector.getAddress('cosmos');

// Connecting Metamask
const connector = new WalletConnector(
    new MetamaskWallet(window.ethereum)
);
const evmosEthChainId = '0x2329';
const address = await connector.getAddress('0x2329');
console.log(address); // Returns evmos... address
```

## Current wallets

 - Keplr (https://www.keplr.app/)
 - Metamask (https://metamask.io/

## Current EVM blockchains

    | Chain Name | Network ID | Ethereum ID | URL |
    |------------|------------|-------------|-----|
    | EVMOS      | 9000       | 0x2329 | https://evmos.org/ |
    | Rebus      | 1000       | 0x457 | https://rebuschain.com/ |