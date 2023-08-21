/**
 * withdrawalbundle.js - a withdrawal bundle module for bip 300, 301 sidechains.
 * Copyright (c) 2023, Jonathan Joseph Gonzales Gutierrez (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const layout = require('../blockchain/layout');
const common = require('../blockchain/common');
const consensus = require('../protocol/consensus');
const MTX = require('../primitives/mtx');
const Sidechain = require('./sidechain');
const {inspectSymbol} = require('../utils');

/*
 * WithdrawalBundle Status
 * @readonly
 * @enum {Number}
 */
const withdrawalStatus = {
  Unknown: 0x00,
  Failed: 0x01,
  Created: 0x02,
  Spent: 0x03
};

const statusByVal = {
  0x00: 'Unknown',
  0x01: 'Failed',
  0x02: 'Created',
  0x03: 'Spent'
};

/*
 * Constant Booleans
 */

const UNKNOWN = (s) => {
  return s === withdrawalStatus.UNKNOWN;
};

const WITHDRAWAL_BUNDLE_FAILED = (s) => {
  return s === withdrawalStatus.Failed;
};

const WITHDRAWAL_BUNDLE_CREATED =  (s) => {
  return s === withdrawalStatus.Created;
};

const WITHDRAWAL_BUNDLE_SPENT = (s) => {
  return s === withdrawalStatus.Spent;
};

/**
 * WithdrawalBundle
 * @alias module:sidechain.withdrawalbundle
 * @extends {Sidechain} Sidechain
 * @property {Number} sidechain
 * @property {MTX} tx
 * @property {Buffer} withdrawalID
 * @property {Number} height
 * @property {Number} failedHeight
 * @property {Number} status
 */

class WithdrawalBundle extends Sidechain {

  /**
   * Create a withdrawal bundle
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.sidechain = common.THIS_SIDECHAIN;
    this.tx = new MTX();
    this.withdrawalID = null;
    this.height = -1;
    this.failedHeight = -1;
    this.status = withdrawalStatus.Created;

      if (options)
      this.fromOptions(options);
  }

  /**
   * Inject properties from object.
   * @private
   * @param {Object} options
   * @returns {Options}
   */

  fromOptions(options) {

    if (options.sidechain != null) {
      assert(typeof options.sidechain === 'number');
      this.sidechain = options.sidechain;
    }

    if (options.tx != null) {
      assert(typeof options.tx === 'object')
      this.tx = options.tx;
    }

    if (options.withdrawalID != null) {
      assert(typeof options.withdrawalID === 'object');
      this.withdrawalID = options.withdrawalID;
    }

    if (options.height != null) {
      assert(typeof options.height === 'number');
    this.height = options.height;
    }

    if (options.failedHeight != null) {
      assert(typeof options.failedHeight === 'number');
      this.failedHeight = options.failedHeight;
    }

    if (options.status != null) {
      assert(status[options.status], 'Invalid status code');
      this.status = options.status;
    }

    this.sidechain = options.sidechain;
    this.tx = options.tx;
    this.withdrawalID = options.withdrawalID;
    this.height = options.height;
    this.failedHeight = options.failedHeight;
    this.status = options.status;

    return this;
  }

  /**
   * Inject properties from a JSON object
   * @param {Object} json
   */

  fromJSON(json) {
    this.sidechain = json.sidechain;
    this.tx = json.tx;
    this.withdrawalID = json.withdrawalID;
    this.status = json.statusCode;
    this.height = json.height;
    this.failedHeight = json.failedHeight;

    return this;
  }

  /**
   * Write the raw withdrawal bundle
   * into a Buffer Writer
   * @params {BufferWriter} bw
   * @returns {Buffer}
   */

  write(bw) {
    bw.writeU8(this.sidechain);
    bw.writeHash(this.tx.hash());
    bw.writeVarBytes(this.withdrawalID);
    bw.writeU8(this.status);
    bw.writeU32(this.height);
    bw.writeU32(this.failedHeight);
    return bw;
  }

  /**
   * Reads the withdrawal bundle
   * @param {BufferReader} br
   * @returns {WithdrawalBundle}
   */

  read(br) {
    this.sidechain = br.readU8();
    this.tx = br.readHash();
    this.withdrawalID = br.readHash();
    this.status = br.readU8();
    this.height = br.readU32();
    this.failedHeight = br.readU32();
    return this;
  }

  /**
   * Checks if the withdrawal status if unspent, failed
   * @returns {Boolean}
   */

  isFailed() {
    return WITHDRAWAL_BUNDLE_FAILED(this.status);
  }

  /*
   * Checks if the current withdrawal status is spent
   * @returns {Boolean}
   */

  isSpent() {
    return WITHDRAWAL_BUNDLE_SPENT(this.status);
  }

  /**
   * Checks if the current withdrawal status is pending
   * @returns {Boolean}
   */

  isCreated() {
    return WITHDRAWAL_BUNDLE_CREATED(this.status);
  }

  /**
   * Check

  /**
   * Checks if the latest withdrawal bundle hash is found.
   * @param {Hash} hash
   * @returns {Boolean}
   */

  async hasLatestWithdrawal(hash) {
    return this.db.getLatestWithdrawal(hash);
  }

  /**
   * Returns the hash of the Spent WithdrawalBundle Script
   * @returns {Hash}
   */

  getSpentWithdrawalBundle() {
    return this.script.getSpentWithdrawalBundle();
  }

  /**
   * Returns the hash of the Failed Withdrawal Script.
   * @returns {Hash}
   */

  getFailedWithdrawalCommitment() {
    return this.script.getFailedWithdrawalCommitment();
  }

  /**
   * Returns the hash of the Created Withdrawal Bundle hash
   * @returns {Hash}
   */

  getWithdrawalBundleCommitment() {
    return this.script.getWithdrawalBundleHashCommit();
  }

  /**
   * Compare the two different withdrawal bundles heights
   * @returns {Number}
   */

  compareBundleByHeight(block1, block2) {
    return cmp(block1.height, block2.height)
  }

  /**
   * Inspect the withdrawal bundle
   * @returns {Object}
   */

  [inspectSymbol]() {
    return '<WithdrawalBundle:'
    + ` sidechain=${this.sidechain}`
    + ` tx=${this.tx.hash().toString('hex')}`
    + ` status=${this.status}`
    + `>`;
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

module.exports = WithdrawalBundle;
