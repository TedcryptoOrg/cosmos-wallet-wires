import { decode } from 'bech32'

export function getPrefixFromWallet (walletAddress: string) {
  const decoded = decode(walletAddress)

  return decoded.prefix
}
