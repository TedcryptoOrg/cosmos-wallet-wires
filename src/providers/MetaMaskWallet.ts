import {ethToRebus} from "../ethermint-address-converter/converter";
import {ethToEvmos} from "@tharsis/address-converter";

export default class MetaMaskWallet implements Wallet {
    private wallet: any;
    private isConnected: boolean;
    private ethChains = {
        'evmos': '0x2329',
        'rebus': '0x457',
    }

    constructor(wallet: any) {
        this.wallet = wallet;
        this.isConnected = false;
    }

    async connect(chainId: string, chainData: any) {
        if (this.isConnected) {
            console.log("Already connected to Metamask wallet.");

            return;
        }

        if (!this.isInstalled()) {
            throw new Error('[Metamask] Please install Metamask Extension')
        }

        const ethChainId = await this.wallet.request({ method: 'eth_chainId' });
        if (!ethChainId) {
            throw new Error('Problem fetching ethereum chain id from metamask. Check metamask extension or reload the browser!');
        }

        this.isConnected = true;

        console.log("[Metamask] Connected to MM wallet!");
    }

    disconnect() {
        if (this.isConnected) {
            console.log("Disconnecting from Keplr wallet...");
            this.wallet = null; // disconnect from the Keplr wallet
            this.isConnected = false;
            console.log("Disconnected from Keplr wallet.");
        } else {
            console.log("Already disconnected from Keplr wallet.");
        }
    }

    async getAddress(chainId: string): Promise<string> {
        chainId = chainId || this.ethChains['evmos'];

        const ethChainId = await this.wallet.request({ method: 'eth_chainId' });
        if (!ethChainId) {
            throw new Error('Problem fetching ethereum chain id from metamask. Check metamask extension or reload the browser!');
        }

        const chainSlug = this.getEthereumChainName(chainId);
        if (!chainSlug) {
            throw new Error('Unknown chain id ' + chainId);
        }

        if (ethChainId !== chainId) {
            console.error('[Metamask] Expected chain id '+chainId+' but got ' + ethChainId + '.');

            throw new Error('[Metamask] Not connected to the correct network. Please switch to ' + chainSlug);
        }

        const ethAccounts = await this.wallet.request({ method: 'eth_requestAccounts' });
        if ('rebus' === chainSlug) {
            return ethToRebus(ethAccounts[0]);
        } else if ('evmos' === chainSlug) {
            return ethToEvmos(ethAccounts[0]);
        } else {
            throw new Error('Unknown chain slug ' + chainSlug)
        }
    }

    isInstalled(): boolean {
        if (typeof this.wallet === 'undefined') {
            return false;
        }

        return this.wallet.isMetaMask;
    }

    getEthereumChainName(ethChainId: string): string|null {
        for (const [key, value] of Object.entries(this.ethChains)) {
            if (value === ethChainId) {
                return key;
            }
        }

        return null;
    }
}