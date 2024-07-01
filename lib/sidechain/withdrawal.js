/**
 * withdrawal.js - a withdrawal module for bip 300, 301 sidechains.
 * Copyright (c) 2023-2024 Jonathan Joseph Gonzales Gutierrez (MIT License).
 * https://github.com/educationofjon/sidechain
 */

'use strict';

const assert = require('bsert');
const Amount = require('../btc/amount');
const Address = require('../primitives/address');
const common = require('../blockchain/common');
const consensus = require('../protocol/consensus');
const layout = require('../blockchain/layout');
const MTX = require('../primitives/mtx');
const SidechainObject = require('./sidechain');
const {inspectSymbol} = require('../utils');


/**
 * Different database key entries
 * for the different withdrawal statuses, zones
 */

const CHARS = {
  UNSPENT: layout.z,
  FAILED: layout.f,
  SPENT: layout.s,
  INPUT_BUNDLE: layout.I
};

/*
 * Withdrawal Status / Zone
 * @readonly
 * @enum {Number}
 */
const withdrawalStatus = {
  Unknown: 0x00,
  Unspent: 0x01,
  Pending: 0x02,
  Spent: 0x03
};

const statusByVal = {
  0x00: 'Unknown',
  0x01: 'Unspent',
  0x02: 'Pending',
  0x03: 'Spent'
};

/*
 * Constant Booleans
 */

const Unknown = (s) => {
  return s === withdrawalStatus.Unknown;
};

const WITHDRAWAL_UNSPENT = (s) => {
  return s === withdrawalStatus.Unspent;
};

const WITHDRAWAL_IN_BUNDLE =  (s) => {
  return s === withdrawalStatus.Pending;
};

const WITHDRAWAL_SPENT = (s) => {
  return s === withdrawalStatus.Spent;
};

/**
 * Withdrawal
 * @alias module:sidechain.Withdrawal
 * @property {Number} sidechain
 * @property {Address} destination
 * @property {Address} refundAddress
 * @property {Amount} amount
 * @property {Amount} mainchainFee
 * @property {Number} status
 * @property {Hash} blindTXHash
 */

class Withdrawal extends SidechainObject {

  /**
   * Create a withdrawal struct.
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.obj = CHARS.UNSPENT;
    this.sidechain = common.THIS_SIDECHAIN;
    this.destination = new Address();
    this.refundAddress = new Address();
    this.amount = new Amount(consensus.CRITICAL_DATA_AMT).toValue();
    this.mainchainFee = new Amount(consensus.SIDECHAIN_DEPOSIT_FEE).toValue();
    this.status = withdrawalStatus.Unspent;
    this.blindTXHash = consensus.ZERO_HASH; // A Hash of the transaction minus the serialized output

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

    if (options.status != null) {
      assert(status[options.status], 'Invalid status code.');
      this.status = options.status;
    }

    this.obj = options.obj;
    this.sidechain = options.sidechain;
    this.destination = options.destination;
    this.refundAddress = options.refundAddress;
    this.amount = options.amount;
    this.mainchainFee = options.mainchainFee;
    this.status = options.status;

    return this;
  }

  /**
   * Write the raw withdrawal info a buffer writer
   * @params {BufferWriter} bw
   * @returns {Buffer}
   */

  write(bw) {
    bw.writeBytes(this.obj.encode());
    bw.writeU8(this.sidechain);
    bw.writeI8(this.amount.toValue());
    bw.writeI8(this.mainchainFee.toValue());
    bw.writeU8(this.mainchainFee);
    bw.writeU8(this.status);
    return bw;
  }

  /**
   * reads the content of the withdrawal
   * @param {BufferReader} br
   * @returns {Withdrawal}
   */

  read(br) {
    this.obj = br.readBytes();
    this.sidechain = br.readU8();
    this.amount = br.readI8();
    this.mainchainFee = br.readI8();
    this.status = br.readU8();
    return this;
  }


  /**
   * Checks whether the withdrawal status is unspent
   * @returns {Boolean}
   */

  isUnspent() {
    return WITHDRAWAL_UNSPENT(this.status);
  }

  /**
   * Checks whether the withdrawal status is spent
   * @returns {Boolean}
   */

  isSpent() {
    return WITHDRAWAL_SPENT(this.status);
  }

  /**
   * Checks whether the withdrawal status is pending / in bundle
   * @returns {Boolean}
   */

  isPending() {
    return WITHDRAWAL_IN_BUNDLE(this.status);
  }

  /**
   * Compares the fee on both the sidechain, mainchain
   * @returns {Number}
   */

  compareMainchainFee(a, b) {
    return cmp(a, b);
  }

  /**
   * Inspect the withdrawal object
   * @returns {Object}
   */

  [inspectSymbol]() {
    return '<Withdrawal:'
      +  ` sidechain=${this.sidechain}`
      +  ` destination=${this.destination.toString()}`
      +  ` refundAddress=${this.refundAddress.toString()}`
      +  ` amount=${this.amount.toString()}`
      +  ` mainchainFee: ${this.mainchainFee.toString()}`
      +  ` status: ${this.status}`
      +  ` blindTXHash: ${this.blindTXHash.toString('hex')}`
      +  `>`;
  }
}

/*
 * Helpers
 */

function cmp(a, b) {
  return a - b;
}

function strcmp(a, b) {
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (a[i] < b[i])
      return -1;
    if (a[i] > b[i])
      return 1;
  }

  if (a.length < b.length)
    return -1;

  if (a.length > b.length)
    return 1;

  return 0;
}


module.exports = Withdrawal;
