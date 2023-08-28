export {}

declare global {
  interface Window {
    // Keplr extension window variables
    keplr: any
    getOfflineSigner: any
    // Metamask extension window variables
    ethereum: any
  }
}
