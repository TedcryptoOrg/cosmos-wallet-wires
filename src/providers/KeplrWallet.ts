import { type Wallet } from '../Wallet'

export default class KeplrWallet implements Wallet {
  private wallet: any
  private readonly offlineSigner: any
  private isConnected: boolean

  constructor (wallet: any, offlineSigner: any) {
    this.wallet = wallet
    this.offlineSigner = offlineSigner
    this.isConnected = false
  }

  async connect (chainId: string, chainData: any) {
    if (this.isConnected) {
      console.log('Already connected to Keplr wallet.')

      return
    }

    if (!this.isInstalled()) {
      if (!this.offlineSigner || !this.wallet) { throw new Error('Please install Keplr extension') }

      if (!this.wallet.experimentalSuggestChain) { throw new Error('Please update your Keplr Extension') }
    }

    console.log('[Keplr] Trying to connect wallet to chain ' + chainId + '...')

    // Suggest chain
    try {
      if (chainData) {
        await this.wallet.experimentalSuggestChain(chainData)
      }
    } catch (error) {
      console.error(error)
    }

    try {
      await this.wallet.enable(chainId)
    } catch (error) {
      console.error(error)
    }

    this.isConnected = true

    console.log('[Keplr] Connected to Keplr wallet!')
  }

  disconnect () {
    if (this.isConnected) {
      console.log('Disconnecting from Keplr wallet...')
      this.wallet = null // disconnect from the Keplr wallet
      this.isConnected = false
      console.log('Disconnected from Keplr wallet.')
    } else {
      console.log('Already disconnected from Keplr wallet.')
    }
  }

  async getAddress (chainId: string): Promise<string> {
    try {
      await this.wallet.enable(chainId)
      const offlineSigner = this.offlineSigner(chainId)

      const accounts = await offlineSigner.getAccounts()
      console.log(accounts, typeof (accounts))
      if (typeof accounts === 'object') {
        return accounts[0].address
      }

      return accounts
    } catch (error) {
      console.error(error)

      throw new Error('Problem fetching address from keplr')
    }
  }

  isInstalled () {
    if (!this.offlineSigner || !this.wallet) {
      return false
    }

    return this.wallet.experimentalSuggestChain
  }
}
