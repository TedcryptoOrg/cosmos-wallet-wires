export default class WalletConnector {
    private wallet: Wallet;

    private readonly chainId;
    private readonly chainData;

    constructor(wallet: Wallet, chainId: string, chainData: any) {
        this.wallet = wallet;
        this.chainId = chainId;
        this.chainData = chainData;
    }

    async connect() {
        await this.wallet.connect(this.chainId, this.chainData);
    }

    disconnect() {
        this.wallet.disconnect();
    }

    async getAddress(): Promise<string> {
        return await this.wallet.getAddress(this.chainId);
    }
}