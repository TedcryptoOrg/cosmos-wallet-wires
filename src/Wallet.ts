export interface Wallet {
    connect(chainId: string, chainData: any): void;
    disconnect(): void;
    getAddress(chainId: string): Promise<string>;
}