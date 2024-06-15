/**
 * deposit.js - a sidechain deposit module for bip300, bip301 sidechains.
 * Copyright (c) 2023, Jonathan Joseph Gonzales Guiterrez
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const bio = require('bufio');
const Amount = require('../btc/amount');
const Sidechain = require('./sidechain');
const common = require('../blockchain/common');
const layout = require('../blockchain/layout');
const {inspectSymbol} = require('../utils');
const MTX = require('../primitives/mtx');

/**
 * Deposit
 * @alias module:sidechain.Deposit
 * @property {Number} sidechain
 * @property {Amount} amount
 * @property {MTX} depositTX
 * @property {Number} index
 * @property {Number} tx
 * @property {Hash} mainchainBlock
 */

class Deposit extends Sidechain {
  /**
   * Create a Deposit struct
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.options = new DepositOptions(options);
    this.sidechain = common.THIS_SIDECHAIN;
    this.amount = new Amount(0);
    this.depositTX = new MTX();
    this.index = 0;
    this.tx = 0;
    this.mainchainBlock = null;

    if (options)
      this.fromOptions(options);
  }

  /**
   * Inject properties from object.
   * @private
   * @returns {Options}
   */

  fromOptions(options) {

    if (options.sidechain != null) {
      assert(typeof options.sidechain === 'number');
      this.sidechain = options.sidechain;
    }

    if (options.amount != null) {
      assert(typeof options.amount.toValue() === 'number');
      this.amount = options.amount;
    }

    if (options.index != null) {
      assert(typeof options.index === 'number');
      this.index = options.index;
    }

    if (options.tx != null) {
      assert(typeof options.tx === 'number');
      this.tx = options.tx;
    }

    if (options.mainchainBlock != null) {
      assert(Buffer.isBuffer(mainchainBlock));
      this.mainchainBlock = options.mainchainBlock;
    }

    this.sidechain = options.sidechain;
    this.amount = options.amount;
    this.index = options.index;
    this.tx = options.tx;
    this.mainchainBlock = options.mainchainBlock;

    return this;

  }

  getObj(hash) {
    return this.layout.D.decode(hash);
  }

  getID() {
    return this;
  }

  /**
   * Write the raw deposit into a buffer.
   * @params {BufferWriter} bw
   * @returns {Buffer}
   */

  write(bw) {
    bw.writeU8(this.sidechain);
    bw.writeU32(this.index);
    bw.writeU32(this.tx);
    bw.writeHash(this.mainchainBlock);
    return bw;
  }

  read(br) {
    br.readU8(this.sidechain);
    br.readI8(this.index);
    br.readI8(this.tx);
    br.readHash(this.mainchainBlock);
    return br;
  }

  /**
   * Inspect the deposit object
   * @returns {Object}
   */

  [inspectSymbol]() {
    return '<Deposit:'
     + ` sidechain=${this.sidechain}`
     + ` index=${this.index}`
     + ` tx=${this.tx}`
     + `>`;
  }
}

class DepositOptions {
  constructor(options) {
    this.options = options;
  }
}

module.exports = Deposit;
