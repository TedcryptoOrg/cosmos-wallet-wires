import {getPrefixFromWallet} from "../../../src/util/walletTools";

describe('WalletTools', () => {
    it('should decode a wallet address and return prefix', () => {
        expect(
            getPrefixFromWallet('osmo1xk23a255qm4kn6gdezr6jm7zmupn23t3mh63ya')
        ).toBe('osmo')
    });

    it('should fail if wallet address is invalid', () => {
        expect(
            () => getPrefixFromWallet('invalid')
        ).toThrowError('invalid too short');
    });
});