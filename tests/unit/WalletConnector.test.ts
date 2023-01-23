import WalletConnector from "../../src/WalletConnector";
import {Wallet} from "../../src/Wallet";

describe('WalletConnector', () => {
    let walletConnector: WalletConnector;
    let wallet: Wallet;

    beforeEach(() => {
        wallet = {
            connect: jest.fn(),
            disconnect: jest.fn(),
            getAddress: jest.fn()
        };
        walletConnector = new WalletConnector(wallet, 'test-chain', {});
    });

    describe('connect', () => {
        it('should call the connect method of the wallet', async () => {
            jest.spyOn(wallet, 'connect');
            await walletConnector.connect();
            expect(wallet.connect).toHaveBeenCalledWith('test-chain', {});
        });
    });

    describe('disconnect', () => {
        it('should call the disconnect method of the wallet', () => {
            jest.spyOn(wallet, 'disconnect');
            walletConnector.disconnect();
            expect(wallet.disconnect).toHaveBeenCalled();
        });
    });

    describe('getAddress', () => {
        it('should call the getAddress method of the wallet', async () => {
            jest.spyOn(wallet, 'getAddress').mockResolvedValueOnce('address');
            const result = await walletConnector.getAddress();
            expect(wallet.getAddress).toHaveBeenCalledWith('test-chain');
            expect(result).toBe('address');
        });
    });
});
