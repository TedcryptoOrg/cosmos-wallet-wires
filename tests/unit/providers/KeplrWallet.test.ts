import KeplrWallet from '../../../src/providers/KeplrWallet';

describe('KeplrWallet', () => {
    let keplrWallet: any;
    let mockWallet: any;
    let offlineSigner: any;

    beforeEach(() => {
        mockWallet = {
            experimentalSuggestChain: jest.fn(),
            enable: jest.fn()
        };
        offlineSigner = {};
        keplrWallet = new KeplrWallet(mockWallet, offlineSigner);
    });

    describe('connect', () => {
        it('should connect to the Keplr wallet', async () => {
            const chainId = 'cosmoshub-4';
            const chainData = {};
            await keplrWallet.connect(chainId, chainData);
            expect(mockWallet.experimentalSuggestChain).toHaveBeenCalledWith(chainData);
            expect(mockWallet.enable).toHaveBeenCalledWith(chainId);
            expect(keplrWallet.isConnected).toBe(true);
        });

        it('should not connect to the Keplr wallet if it is already connected', async () => {
            keplrWallet.isConnected = true;
            const chainId = 'cosmoshub-4';
            const chainData = {};
            await keplrWallet.connect(chainId, chainData);
            expect(mockWallet.experimentalSuggestChain).not.toHaveBeenCalled();
            expect(mockWallet.enable).not.toHaveBeenCalled();
            expect(keplrWallet.isConnected).toBe(true);
        });
    });

    describe('disconnect', () => {
        it('should disconnect from the Keplr wallet', () => {
            keplrWallet.isConnected = true;
            keplrWallet.disconnect();
            expect(keplrWallet.wallet).toBe(null);
            expect(keplrWallet.isConnected).toBe(false);
        });

        it('should not disconnect from the Keplr wallet if it is already disconnected', () => {
            keplrWallet.disconnect();
            expect(keplrWallet.wallet).not.toBe(null);
            expect(keplrWallet.isConnected).toBe(false);
        });
    });

    describe('getAddress', () => {
        it('should return the address of the Keplr wallet', async () => {
            const chainId = 'cosmoshub-4';
            const address = 'cosmos1l8xhyx6xvx6x5x6x5x6x5x6x5x6x5x6x5';
            const mockOfflineSigner = jest.fn().mockReturnValue({
                getAccounts: jest.fn().mockResolvedValueOnce([{ address }])
            });
            keplrWallet = new KeplrWallet(mockWallet, mockOfflineSigner);
            await keplrWallet.connect(chainId, {});
            const result = await keplrWallet.getAddress(chainId);
            expect(result).toBe(address);
        });

        it('should throw an error if there is a problem fetching the address', async () => {
            const chainId = 'cosmoshub-4';
            const mockOfflineSigner = jest.fn().mockReturnValue({
                getAccounts: jest.fn().mockRejectedValueOnce(new Error('Problem fetching accounts'))
            });
            keplrWallet = new KeplrWallet(mockWallet, mockOfflineSigner);
            await keplrWallet.connect(chainId, {});
            try {
                await keplrWallet.getAddress(chainId);
            } catch (error: any) {
                expect(error.message).toBe('Problem fetching address from keplr');
            }
        });
    });
});
