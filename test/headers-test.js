/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('bsert');
const Headers = require('../lib/primitives/headers');
const Block = require('../lib/primitives/block');
const Network = require('../lib/protocol/network');

/*
 * Constants
 */

const network = Network.get('regtest');
const genesis = network.genesisBlock;
const block = Block.fromRaw(genesis, 'hex');

describe('Headers', function() {
  it('should match headers size', () => {
    const headers = new Headers();

    assert.strictEqual(headers.getSize(), 137);
  });

  it('should match block1 headers from block', () => {
    const blk1 = block;
    const headers = Headers.fromBlock(blk1);

    assert.strictEqual(headers.getSize(), 137);

    assert.strictEqual(headers.time, 0);
    assert.strictEqual(headers.version, 1);

    assert.strictEqual(headers.prevBlock.toString('hex'),
      '0000000000000000000000000000000000000000000000000000000000000000');
    assert.strictEqual(headers.merkleRoot.toString('hex'),
      '8a6be158deb38d5cc20aa8612ac303bb7ae59520d3b22213df5e88434f36b18e');
    assert.strictEqual(headers.rhash(),
      '14d9aa5f9fbaa70eb702a64e5e9d1684ad38bf31737c17bd19b5b49705444774');

    assert(headers.verifyBody());
    assert(headers.verifyPOW());
  });
});
