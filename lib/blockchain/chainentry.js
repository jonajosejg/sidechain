/*!
 * chainentry.js - mainchainentry object for bitcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('bsert');
const bio = require('bufio');
const BN = require('bcrypto/lib/bn.js');
const consensus = require('../protocol/consensus');
const hash256 = require('bcrypto/lib/hash256');
const util = require('../utils/util');
const Headers = require('../primitives/headers');
const InvItem = require('../primitives/invitem');
const {inspectSymbol} = require('../utils');

/*
 * Constants
 */

const ZERO = new BN(0);

/**
 * Chain Entry
 * Represents an entry in the chain. Unlike
 * other bitcoin fullnodes, we store the
 * chainwork _with_ the entry in order to
 * avoid reading the entire chain index on
 * boot and recalculating the chainworks.
 * @alias module:blockchain.ChainEntry
 * @property {Hash} hash
 * @property {Number} version
 * @property {Hash} prevBlock
 * @property {Hash} merkleRoot
 * @property {Hash} withdrawalBundle
 * @property {Hash} mainchainBlock
 * @property {Number} time
 * @property {Number} height
 * @property {BN} chainwork
 * @property {Hash} rhash
 */

class ChainEntry {
  /**
   * Create a chain entry.
   * @constructor
   * @param {Object?} options
   */

  constructor(options) {
    this.hash = consensus.ZERO_HASH;
    this.version = 1;
    this.prevBlock = consensus.ZERO_HASH;
    this.merkleRoot = consensus.ZERO_HASH;
    this.withdrawalBundle = consensus.ZERO_HASH;
    this.mainchainBlock = consensus.ZERO_HASH;
    this.time = 0;
    this.height = 0;

    if (options)
      this.fromOptions(options);
  }

  /**
   * Inject properties from options.
   * @private
   * @param {Object} options
   */

  fromOptions(options) {
    assert(options, 'Block data is required.');
    assert(Buffer.isBuffer(options.hash));
    assert((options.version >>> 0) === options.version);
    assert(Buffer.isBuffer(options.prevBlock));
    assert(Buffer.isBuffer(options.merkleRoot));
    assert(Buffer.isBuffer(options.withdrawalBundle));
    assert(Buffer.isBuffer(options.mainchainBlock));
    assert((options.time >>> 0) === options.time);
    assert((options.height >>> 0) === options.height);

    this.hash = options.hash;
    this.version = options.version;
    this.prevBlock = options.prevBlock;
    this.merkleRoot = options.merkleRoot;
    this.withdrawalBundle = options.withdrawalBundle;
    this.mainchainBlock = options.mainchainBlock;
    this.time = options.time;
    this.height = options.height;

    return this;
  }

  /**
   * Instantiate mainchainentry from options.
   * @param {Object} options
   * @param {ChainEntry} prev - Previous entry.
   * @returns {ChainEntry}
   */

  static fromOptions(options, prev) {
    return new this().fromOptions(options, prev);
  }

  /**
   * Calculate the proof: (1 << 256) / (target + 1)
   * @returns {BN} proof
   */

  getProof() {
    const target = consensus.fromCompact(this.bits);

    if (target.isNeg() || target.isZero())
      return new BN(0);

    return ChainEntry.MAX_CHAINWORK.div(target.iaddn(1));
  }

  /**
   * Calculate the chainwork by
   * adding proof to previous chainwork.
   * @returns {BN} chainwork
   */

  getChainwork(prev) {
    const proof = this.getProof();

    if (!prev)
      return proof;

    return proof.iadd(prev.chainwork);
  }

  /**
   * Test against the genesis block.
   * @returns {Boolean}
   */

  isGenesis() {
    return this.height === 0;
  }

  /**
   * Test whether the entry contains a version bit.
   * @param {Number} bit
   * @returns {Boolean}
   */

  hasBit(bit) {
    return consensus.hasBit(this.version, bit);
  }

  /**
   * Get little-endian block hash.
   * @returns {Hash}
   */

  rhash() {
    return util.revHex(this.hash);
  }

  /**
   * Inject properties from block.
   * @private
   * @param {Block|MerkleBlock} block
   * @param {ChainEntry} prev - Previous entry.
   */

  fromBlock(block, prev) {
    this.hash = block.hash();
    this.version = block.version;
    this.prevBlock = block.prevBlock;
    this.merkleRoot = block.merkleRoot;
    this.withdrawalBundle = block.withdrawalBundle;
    this.mainchainBlock = block.mainchainBlock;
    this.time = block.time;
    this.height = prev ? prev.height + 1 : 0;
    return this;
  }

  /**
   * Instantiate chainentry from block.
   * @param {Block|MerkleBlock} block
   * @param {ChainEntry} prev - Previous entry.
   * @returns {ChainEntry}
   */

  static fromBlock(block, prev) {
    return new this().fromBlock(block, prev);
  }

  /**
   * Serialize the entry to internal database format.
   * @returns {Buffer}
   */

  toRaw() {
    const bw = bio.write(140);

    bw.writeU32(this.version);
    bw.writeHash(this.prevBlock);
    bw.writeHash(this.merkleRoot);
    bw.writeHash(this.withdrawalBundle);
    bw.writeHash(this.mainchainBlock);
    bw.writeU32(this.time);
    bw.writeU32(this.height);

    return bw.render();
  }

  /**
   * Inject properties from serialized data.
   * @private
   * @param {Buffer} data
   */

  fromRaw(data) {
    const br = bio.read(data, true);
    const hash = hash256.digest(br.readBytes(140));

    br.seek(-140);

    this.hash = hash;
    this.version = br.readU32();
    this.prevBlock = br.readHash();
    this.merkleRoot = br.readHash();
    this.withdrawalBundle = br.readHash();
    this.mainchainBlock = br.readHash();
    this.time = br.readU32();
    this.height = br.readU32();

    return this;
  }

  /**
   * Deserialize the entry.
   * @param {Buffer} data
   * @returns {ChainEntry}
   */

  static fromRaw(data) {
    return new this().fromRaw(data);
  }

  /**
   * Serialize the entry to an object more
   * suitable for JSON serialization.
   * @returns {Object}
   */

  toJSON() {
    return {
      hash: util.revHex(this.hash),
      version: this.version,
      prevBlock: util.revHex(this.prevBlock),
      merkleRoot: util.revHex(this.merkleRoot),
      withdrawalBundle: util.revHex(this.withdrawalBundle),
      mainchainBlock: util.revHex(this.mainchainBlock),
      time: this.time,
      height: this.height
     };
  }

  /**
   * Inject properties from json object.
   * @private
   * @param {Object} json
   */

  fromJSON(json) {
    assert(json, 'Block data is required.');
    assert(typeof json.hash === 'string');
    assert((json.version >>> 0) === json.version);
    assert(typeof json.prevBlock === 'string');
    assert(typeof json.merkleRoot === 'string');
    assert(typeof json.withdrawalBundle === 'string');
    assert(typeof json.mainchainBlock === 'string');
    assert((json.time >>> 0) === json.time);

    this.hash = util.fromRev(json.hash);
    this.version = json.version;
    this.prevBlock = util.fromRev(json.prevBlock);
    this.merkleRoot = util.fromRev(json.merkleRoot);
    this.withdrawalBundle = util.fromRev(json.withdrawalBundle);
    this.mainchainBlock = util.fromRev(json.mainchainBlock);
    this.time = json.time;
    this.height = json.height;

    return this;
  }

  /**
   * Instantiate block from jsonified object.
   * @param {Object} json
   * @returns {ChainEntry}
   */

  static fromJSON(json) {
    return new this().fromJSON(json);
  }

  /**
   * Convert the entry to a headers object.
   * @returns {Headers}
   */

  toHeaders() {
    return Headers.fromEntry(this);
  }

  /**
   * Convert the entry to an inv item.
   * @returns {InvItem}
   */

  toInv() {
    return new InvItem(InvItem.types.BLOCK, this.hash);
  }

  /**
   * Return a more user-friendly object.
   * @returns {Object}
   */

  [inspectSymbol]() {
    const json = this.toJSON();
    json.version = json.version.toString(16);
    return json;
  }

  /**
   * Test whether an object is a {@link ChainEntry}.
   * @param {Object} obj
   * @returns {Boolean}
   */

  static isChainEntry(obj) {
    return obj instanceof ChainEntry;
  }
}

/**
 * The max chainwork (1 << 256).
 * @const {BN}
 */

ChainEntry.MAX_CHAINWORK = new BN(1).ushln(256);

/*
 * Expose
 */

module.exports = ChainEntry;
