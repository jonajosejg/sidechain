/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const Network = require('../lib/protocol/network');
const Address = require('../lib/primitives/address');
const Script = require('../lib/script/script');
const assert = require('bsert');
const nodejsUtil = require('util');

describe('Address', function() {
  it('should match mainnet p2pkh address', () => {
    const raw = 'e34cce70c86373273efcc54ce7d2a491bb4a0e84';
    const p2pkh = Buffer.from(raw, 'hex');
    const addr = Address.fromPubkeyhash(p2pkh);
    const expectedAddr = '1MirQ9bwyQcGVJPwKUgapu5ouK2E2Ey4gX';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match mainnet p2pkh address 2', () => {
    const raw = '0ef030107fd26e0b6bf40512bca2ceb1dd80adaa';
    const p2pkh = Buffer.from(raw, 'hex');
    const addr = Address.fromPubkeyhash(p2pkh);
    const expectedAddr = '12MzCDwodF9G1e7jfwLXfR164RNtx4BRVG';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match regtest p2pkh address', () => {
    const raw = '78b316a08647d5b77283e512d3603f1f1c8de68f';
    const p2pkh = Buffer.from(raw, 'hex');
    const addr = Address.fromPubkeyhash(p2pkh);
    const expectedAddr = 'mrX9vMRYLfVy1BnZbc5gZjuyaqH3ZW2ZHz';
    assert.strictEqual(addr.toString('regtest'), expectedAddr);
  });

  it('should handle wrong p2pkh hash length', () => {
    const raw = '000ef030107fd26e0b6bf40512bca2ceb1dd80adaa';
    const p2pkh = Buffer.from(raw, 'hex');
    assert.throws(() => Address.fromPubkeyhash(p2pkh));
  });

  it('should handle empty p2pkh hash length', () => {
    const raw = '';
    const p2pkh = Buffer.from(raw, 'hex');
    assert.throws(() => Address.fromPubkeyhash(p2pkh));
  });

  it('should match mainnet p2sh address obtained from script', () => {
    const p2sh = Buffer.from(''
                          + '52410491bba2510912a5bd37da1fb5b1673010e4'
                          + '3d2c6d812c514e91bfa9f2eb129e1c183329db55'
                          + 'bd868e209aac2fbc02cb33d98fe74bf23f0c235d'
                          + '6126b1d8334f864104865c40293a680cb9c020e7'
                          + 'b1e106d8c1916d3cef99aa431a56d253e69256da'
                          + 'c09ef122b1a986818a7cb624532f062c1d1f8722'
                          + '084861c5c3291ccffef4ec687441048d2455d240'
                          + '3e08708fc1f556002f1b6cd83f992d085097f997'
                          + '4ab08a28838f07896fbab08f39495e15fa6fad6e'
                          + 'dbfb1e754e35fa1c7844c41f322a1863d4621353ae', 'hex');
    const script = Script.fromRaw(p2sh);
    const addr = Address.fromScript(script);
    const expectedAddr = '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match mainnet p2sh address obtained from script hash', () => {
    const raw = 'f815b036d9bbbce5e9f2a00abd1bf3dc91e95510';
    const p2sh = Buffer.from(raw, 'hex');
    const addr = Address.fromScripthash(p2sh);
    const expectedAddr = '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match mainnet p2sh address obtained from script 2', () => {
    const raw = 'e8c300c87986efa84c37c0519929019ef86eb5b4';
    const p2sh = Buffer.from(raw, 'hex');
    const addr = Address.fromScripthash(p2sh);
    const expectedAddr = '3NukJ6fYZJ5Kk8bPjycAnruZkE5Q7UW7i8';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match regtest p2sh address', () => {
    const raw = 'c579342c2c4c9220205e2cdc285617040c924a0a';
    const p2sh = Buffer.from(raw, 'hex');
    const addr = Address.fromScripthash(p2sh);
    const expectedAddr = '2NBFNJTktNa7GZusGbDbGKRZTxdK9VVez3n';
    assert.strictEqual(addr.toString('regtest'), expectedAddr);
  });

  it('should match mainnet segwit p2wpkh v0 address', () => {
    const raw = '751e76e8199196d454941c45d1b3a323f1433bd6';
    const p2wpkh = Buffer.from(raw, 'hex');
    const addr = Address.fromWitnessPubkeyhash(p2wpkh);
    const expectedAddr = 'sc1qw508d6qejxtdg4y5r3zarvary0c5xw7kdkrstm';
    assert.strictEqual(addr.toString('main'), expectedAddr);
  });

  it('should match mainnet segwit p2pwsh v0 address', () => {
    const p2wpkh = Buffer.from(''
                        + '1863143c14c51668'
                        + '04bd19203356da13'
                        + '6c985678cd4d27a1'
                        + 'b8c6329604903262', 'hex');
    const addr = Address.fromWitnessScripthash(p2wpkh);
    assert.strictEqual(addr.toString('main'),
        'sc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qfat2ms');
  });

  it('should match regtest segwit p2wpkh v0 address', () => {
    const raw = '751e76e8199196d454941c45d1b3a323f1433bd6';
    const p2wpkh = Buffer.from(raw, 'hex');
    const addr = Address.fromWitnessPubkeyhash(p2wpkh);
    const expectedAddr = 'scrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kfrckyg';
    assert.strictEqual(addr.toString('regtest'), expectedAddr);
  });

  it('should match testnet segwit p2pwsh v0 address', () => {
    const p2wpkh = Buffer.from(''
                        + '1863143c14c51668'
                        + '04bd19203356da13'
                        + '6c985678cd4d27a1'
                        + 'b8c6329604903262', 'hex');
    const addr = Address.fromWitnessScripthash(p2wpkh);
    assert.strictEqual(addr.toString('regtest'),
        'scrt1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qmvayw3');
  });

  it('should match testnet segwit p2pwsh v0 address 2', () => {
    const p2wpkh = Buffer.from(''
                        + '000000c4a5cad462'
                        + '21b2a187905e5266'
                        + '362b99d5e91c6ce2'
                        + '4d165dab93e86433', 'hex');
    const addr = Address.fromWitnessScripthash(p2wpkh);
    assert.strictEqual(addr.toString('regtest'),
        'scrt1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesh6420t');
  });

  it('should handle invalid segwit hrp', () => {
    const addr = 'tc1qw508d6qejxtdg4y5r3zarvary0c5xw7kg3g4ty';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle invalid segwit checksum', () => {
    const addr = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle invalid segwit version', () => {
    const addr = 'BC13W508D6QEJXTDG4Y5R3ZARVARY0C5XW7KN40WF2';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle invalid segwit program length', () => {
    const addr = 'bc1rw5uspcuh';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle invalid segwit program length 2', () => {
    const addr = 'bc10w508d6qejxtdg4y5r3zarvary0c5xw7kw5'
               + '08d6qejxtdg4y5r3zarvary0c5xw7kw5rljs90';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle invalid segwit program length for witness v0', () => {
    const addr = 'tb1pw508d6qejxtdg4y5r3zarqfsj6c3';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle segwit mixed case', () => {
    const addr = 'tb1qrp33g0q5c5txsp9arysrx4k6z'
               + 'dkfs4nce4xj0gdcccefvpysxf3q0sL5k7';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle segwit zero padding of more than 4 bits', () => {
    const addr = 'tb1pw508d6qejxtdg4y5r3zarqfsj6c3';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should handle segwit non-zero padding in 8-to-5 conversion', () => {
    const addr = 'tb1qrp33g0q5c5txsp9arysrx4k6'
               + 'zdkfs4nce4xj0gdcccefvpysxf3pjxtptv';
    assert.throws(() => Address.fromString(addr, 'main'));
  });

  it('should inspect', () => {
    const obj = new Address();
    const fmt = nodejsUtil.format(obj);
    assert(typeof fmt === 'string');
    assert(fmt.includes('Address'));
    assert(fmt.includes('str='));
  });

  it('should pass all BIP350 test vectors for valid bech32 and bech32m', () => {
    // https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki
    //   #test-vectors-for-v0-v16-native-segregated-witness-addresses
    const vectors = [
      ['BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4', '0014751e76e8199196d454941c45d1b3a323f1433bd6'],
      ['tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7', '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262'],
      ['bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kt5nd6y', '5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6'],
      ['BC1SW50QGDZ25J', '6002751e'],
      ['bc1zw508d6qejxtdg4y5r3zarvaryvaxxpcs', '5210751e76e8199196d454941c45d1b3a323'],
      ['tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy', '0020000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433'],
      ['tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c', '5120000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433'],
      ['bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0', '512079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798']
    ];

    for (const [addr, script] of vectors) {
      const parsed = Address.fromString(addr);
      const buffer = Buffer.from(script, 'hex');

      assert(parsed.isProgram());

      assert.strictEqual(parsed.getType(), 'witness');

      const byte = buffer[0];
      const version = byte ? byte - 0x50 : 0;
      assert.strictEqual(version, parsed.version);

      assert.bufferEqual(buffer.slice(2), parsed.hash);
    }
  });
});
