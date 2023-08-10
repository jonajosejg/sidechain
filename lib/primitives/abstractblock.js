/*!
 * abstractblock.js - abstract block object for bitcoin sidechain
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const hash256 = require('bcrypto/lib/hash256');
const bio = require('bufio');
const util = require('../utils/util');
const InvItem = require('./invitem');
const consensus = require('../protocol/consensus');

/**
 * Abstract Block
 * The class which all block-like objects inherit from.
 * @alias module:primitives.AbstractBlock
 * @abstract
 * @property {Number} version
 * @property {Hash} prevBlock
 * @property {Hash} merkleRoot
 * @property {Hash} withdrawalBundle
 * @property {Hash} mainchainBlock
 * @property {Number} time
 */

class AbstractBlock {
  /**
   * Create an abstract block.
   * @constructor
   */

  constructor() {
    this.version = 1;
    this.prevBlock = consensus.ZERO_HASH;
    this.merkleRoot = consensus.ZERO_HASH;
    this.withdrawalBundle = consensus.ZERO_HASH;
    this.mainchainBlock = consensus.ZERO_HASH;
    this.time = 0;

    this.mutable = false;

    this._hash = null;
    this._hhash = null;
  }

  /**
   * Inject properties from options object.
   * @private
   * @param {Object} options
   */

  parseOptions(options) {
    assert(options, 'Block data is required.');
    assert((options.version >>> 0) === options.version);
    assert(Buffer.isBuffer(options.prevBlock));
    assert(Buffer.isBuffer(options.merkleRoot));
    assert(Buffer.isBuffer(options.withdrawalBundle));
    assert(Buffer.isBuffer(options.mainchainBlock));
    assert((options.time >>> 0) === options.time);

    this.version = options.version;
    this.prevBlock = options.prevBlock;
    this.merkleRoot = options.merkleRoot;
    this.withdrawalBundle = options.withdrawalBundle;
    this.mainchainBlock = options.mainchainBlock;
    this.time = options.time;

    if (options.mutable != null) {
      assert(typeof options.mutable === 'boolean');
      this.mutable = options.mutable;
    }

    return this;
  }

  /**
   * Inject properties from json object.
   * @private
   * @param {Object} json
   */

  parseJSON(json) {
    assert(json, 'Block data is required.');
    assert((json.version >>> 0) === json.version);
    assert(typeof json.prevBlock === 'string');
    assert(typeof json.merkleRoot === 'string');
    assert(typeof json.withdrawalBundle === 'string');
    assert(typeof json.mainchainBlock === 'string');
    assert((json.time >>> 0) === json.time);

    this.version = json.version;
    this.prevBlock = util.fromRev(json.prevBlock);
    this.merkleRoot = util.fromRev(json.merkleRoot);
    this.withdrawalBundle = util.fromRev(json.withdrawalBundle);
    this.mainchainBlock = util.fromRev(json.mainchainBlock);
    this.time = json.time;

    return this;
  }

  /**
   * Test whether the block is a memblock.
   * @returns {Boolean}
   */

  isMemory() {
    return false;
  }

  /**
   * Clear any cached values (abstract).
   */

  _refresh() {
    this._hash = null;
    this._hhash = null;
  }

  /**
   * Clear any cached values.
   */

  refresh() {
    return this._refresh();
  }

  /**
   * Hash the block headers.
   * @param {String?} enc - Can be `'hex'` or `null`.
   * @returns {Hash|Buffer} hash
   */

  hash(enc) {
    let h = this._hash;

    if (!h) {
      h = hash256.digest(this.toHead());
      if (!this.mutable)
        this._hash = h;
    }

    if (enc === 'hex') {
      let hex = this._hhash;
      if (!hex) {
        hex = h.toString('hex');
        if (!this.mutable)
          this._hhash = hex;
      }
      h = hex;
    }

    return h;
  }

  /**
   * Serialize the block headers.
   * @returns {Buffer}
   */

  toHead() {
    return this.writeHead(bio.write(136)).render();
  }

  /**
   * Inject properties from serialized data.
   * @private
   * @param {Buffer} data
   */

  fromHead(data) {
    return this.readHead(bio.read(data));
  }

  /**
   * Serialize the block headers.
   * @param {BufferWriter} bw
   */

  writeHead(bw) {
    bw.writeU32(this.version);
    bw.writeHash(this.prevBlock);
    bw.writeHash(this.merkleRoot);
    bw.writeHash(this.withdrawalBundle);
    bw.writeHash(this.mainchainBlock);
    bw.writeU32(this.time);
    return bw;
  }

  /**
   * Parse the block headers.
   * @param {BufferReader} br
   */

  readHead(br) {
    this.version = br.readU32();
    this.prevBlock = br.readHash();
    this.merkleRoot = br.readHash();
    this.withdrawalBundle = br.readHash();
    this.mainchainBlock = br.readHash();
    this.time = br.readU32();
    return this;
  }

  /**
   * Verify the block.
   * @returns {Boolean}
   */

  verify() {
    if (!this.verifyPOW())
      return false;

    if (!this.verifyBody())
      return false;

    return true;
  }

  /**
   * Verify proof-of-work.
   * @returns {Boolean}
   */

  verifyPOW() {
    return consensus.verifyPOW(this.hash());
  }

  /**
   * Verify the block.
   * @returns {Boolean}
   */

  verifyBody() {
    throw new Error('Abstract method.');
  }

  /**
   * Get little-endian block hash.
   * @returns {Hash}
   */

  rhash() {
    return util.revHex(this.hash());
  }

  /**
   * Convert the block to an inv item.
   * @returns {InvItem}
   */

  toInv() {
    return new InvItem(InvItem.types.BLOCK, this.hash());
  }
}

/*
 * Expose
 */

module.exports = AbstractBlock;
