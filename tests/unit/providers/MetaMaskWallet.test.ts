import MetaMaskWallet from "../../../src/providers/MetaMaskWallet";

describe('MetaMaskWallet', () => {
    let mockWallet: any;
    let metaMaskWallet: any;

    beforeEach(() => {
        mockWallet = {
            request: jest.fn(),
            isMetaMask: true,
        };
        metaMaskWallet = new MetaMaskWallet(mockWallet);
    });

    describe('connect', () => {
        it('should return if already connected', async () => {
            metaMaskWallet.isConnected = true;
            const spy = jest.spyOn(console, 'log');

            await metaMaskWallet.connect('evmos');

            expect(spy).toHaveBeenCalledWith('Already connected to Metamask wallet.');
        });

        it('should throw an error if MetaMask is not installed', async () => {
            mockWallet.isMetaMask = false;

            try {
                await metaMaskWallet.connect('evmos');
            } catch (error: any) {
                expect(error.message).toBe('[Metamask] Please install Metamask Extension');
            }
        });

        it('should throw an error if it cannot fetch the ethereum chain id', async () => {
            mockWallet.request.mockRejectedValueOnce(new Error('Problem fetching ethereum chain id'));

            try {
                await metaMaskWallet.connect('evmos');
            } catch (error: any) {
                expect(error.message).toBe('Problem fetching ethereum chain id');
            }
        });

        it('should set isConnected to true if it can fetch the ethereum chain id', async () => {
            mockWallet.request.mockResolvedValueOnce('0x457');

            await metaMaskWallet.connect('evmos');

            expect(metaMaskWallet.isConnected).toBe(true);
        });
    });

    describe('disconnect', () => {
        it('should set isConnected to false and the wallet to null', () => {
            metaMaskWallet.isConnected = true;
            const spy = jest.spyOn(console, 'log');

            metaMaskWallet.disconnect();

            expect(metaMaskWallet.isConnected).toBe(false);
            expect(metaMaskWallet.wallet).toBe(null);
            expect(spy).toHaveBeenCalledWith('Disconnecting from Keplr wallet...');
            expect(spy).toHaveBeenCalledWith('Disconnected from Keplr wallet.');
        });

        it('should log a message if already disconnected', () => {
            const spy = jest.spyOn(console, 'log');

            metaMaskWallet.disconnect();

            expect(spy).toHaveBeenCalledWith('Already disconnected from Keplr wallet.');
        });
    });

    describe('getAddress', () => {
        it('should return the address in evmos format if chainId is not provided', async () => {
            mockWallet.request.mockResolvedValueOnce('0x2329').mockResolvedValueOnce(['0x1234567890abcdef']);
            const expectedAddress = 'evmos1zg69v7ys40x773l6f7g';

            const result = await metaMaskWallet.getAddress();

            expect(result).toBe(expectedAddress);
        });

        it('should return the address in evmos format if chainId is evmos', async () => {
            mockWallet.request.mockResolvedValueOnce('0x2329').mockResolvedValueOnce(['0x1234567890abcdef']);
            const expectedAddress = 'evmos1zg69v7ys40x773l6f7g';

            const result = await metaMaskWallet.getAddress('0x2329');

            expect(result).toBe(expectedAddress);
        });

        it('should return the address in rebus format if chainId is rebus', async () => {
            mockWallet.request.mockResolvedValueOnce('0x457').mockResolvedValueOnce(['0x1234567890abcdef']);
            const expectedAddress = 'rebus1zg69v7ys40x77uks4wv';

            const result = await metaMaskWallet.getAddress('0x457');

            expect(result).toBe(expectedAddress);
        });

        it('should throw an error if not connected to the correct network', async () => {
            mockWallet.request.mockResolvedValueOnce('0x2329').mockResolvedValueOnce(['0x1234567890abcdef']);
            try {
                await metaMaskWallet.getAddress('0x457');
            } catch (error: any) {
                expect(error.message).toBe('[Metamask] Not connected to the correct network. Please switch to rebus');
            }
        });

        it('should throw an error if it cannot fetch the ethereum chain id', async () => {
            mockWallet.request.mockRejectedValueOnce(new Error('Problem fetching ethereum chain id'));

            try {
                await metaMaskWallet.getAddress('rebus');
            } catch (error: any) {
                expect(error.message).toBe('Problem fetching ethereum chain id');
            }
        });

        it('should throw an error if it cannot fetch the ethereum account', async () => {
            mockWallet.request.mockRejectedValueOnce(new Error('Problem fetching ethereum account'));

            try {
                await metaMaskWallet.getAddress('rebus');
            } catch (error: any) {
                expect(error.message).toBe('Problem fetching ethereum account');
            }
        });

        it('should throw an error if it cannot find the chain slug', async () => {
            mockWallet.request.mockResolvedValueOnce('0x12345').mockResolvedValueOnce(['0x1234567890abcdef']);

            try {
                await metaMaskWallet.getAddress('unknown');
            } catch (error: any) {
                expect(error.message).toBe('Unknown chain id unknown');
            }
        });
    });

    describe('isInstalled', () => {
        it('should return false if the wallet is undefined', () => {
            metaMaskWallet.wallet = undefined;

            const result = metaMaskWallet.isInstalled();

            expect(result).toBe(false);
        });

        it('should return true if the wallet isMetaMask property is true', () => {
            const result = metaMaskWallet.isInstalled();
            expect(result).toBe(true);
        });
    });
});
