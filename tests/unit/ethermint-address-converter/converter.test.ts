import { ethToRebus, rebusToEth } from '../../../src/ethermint-address-converter/converter';

describe('ethToRebus', () => {
    it('should convert an Ethereum address to a REBUS address', () => {
        const ethAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        const expectedRebusAddress = 'rebus1wskntnrxxnq9x2f95wuyf0z9fezr3azwc6nfh2';
        const rebusAddress = ethToRebus(ethAddress);
        expect(rebusAddress).toBe(expectedRebusAddress);
    });
});

describe('rebusToEth', () => {
    it('should convert a REBUS address to an Ethereum address', () => {
        const rebusAddress = 'rebus1wskntnrxxnq9x2f95wuyf0z9fezr3azwc6nfh2';
        const expectedEthAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        const ethAddress = rebusToEth(rebusAddress);
        expect(ethAddress).toBe(expectedEthAddress);
    });

    it('should throw an error if the REBUS address has an invalid checksum', () => {
        const rebusAddress = 'rebus1qpzry9x8gf2tvdw0s3j5ukq0wqzqg3g4h5fyy';
        expect(() => rebusToEth(rebusAddress)).toThrowError('Invalid checksum for rebus1qpzry9x8gf2tvdw0s3j5ukq0wqzqg3g4h5fyy');
    });

    it('should throw an error if the REBUS address is invalid', () => {
        const rebusAddress = 'invalid-address';
        expect(() => rebusToEth(rebusAddress)).toThrowError('No separator character for invalid-address');
    });
});
