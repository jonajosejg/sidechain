/**
 * withdrawals.js - a withdrawal bundle module for sidechains.
 * Copyright (c) 2023, Jonathan Gonzales (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const {Struct} = require('bufio');
const common = require('../blockchain/common');
const layout = require('../blockchain/layout');

/*
 * Withdrawal Status
 * @readonly
 * @enum {Number}
 */
const withdrawalStatus = {
  DEFAULT: 0x00,
  // unspent ('f')
  FAILED: 0x01,
  // pending ('o')
  SPENT: 0x02,
  // bdb.key('w')
  CREATED: 0x03
};

const statusByVal = {
  0x00: 'DEFAULT',
  0x01: 'FAILED',
  0x02: 'SPENT',
  0x03: 'CREATED'
};

/*
 * Constant Booleans
 */

const UNSPENT_WITHDRAWAL = (s) => {
  return s === withdrawalStatus.FAILED;
};


const WITHDRAWAL_SPENT =  (s) => {
  return s === withdrawalStatus.SPENT;
}

const WITHDRAWAL_PENDING = (s) => {
  return s === withdrawalStatus.CREATED;
};

/**
 * Sidechain
 * @alias module:sidechain.WithdrawalBundle
 * @extends {Struct}
 * @property {status} status
 */

class WithdrawalBundle extends Struct {
  /**
   * Create a withdrawal budnel
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.height = -1;
    this.failedHeight = -1;
    this.sidechain = common.THIS_SIDECHAIN;
    this.status = withdrawalStatus.DEFAULT;

    if (options)
      this.fromOptions(options);
  }

  fromOptions(options) {

    if (options.sidechain != null) {
      assert(typeof options.sidechain === 'number');
      this.sidechain = options.sidechain;
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

    this.status = options.status;

    return this;
  }

  /**
   * Inject properties from a JSON object
   * @param {Object} json
   */

  fromJSON(json) {
    assert(json, 'Options are required.');

    this.status = json.statusCode;
    return this;
  }

  /**
   * Write the raw withdrawal bundle
   * into a Buffer Writer
   * @params {BufferWriter} bw
   * @returns {Buffer}
   */

  write(bw) {
    bw.writeU8(this.status);
    return bw;
  }

  /**
   * Reads the withdrawal bundle
   * @param {BufferReader} br
   * @returns {WithdrawalBundle}
   */

  read(br) {
    this.status = br.readU8();
    return this;
  }

  /**
   * Checks if the withdrawal status if unspent, failed
   * @returns {Boolean}
   */

  isUnspent() {
    return UNSPENT_WITHDRAWAL(this.status);
  }

  /*
   * Checks if the current withdrawal status is spent, created
   * @returns {Boolean}
   */

  isSpent() {
    return WITHDRAWAL_SPENT(this.status);
  }

  /**
   * Checks if the current withdrawal status is pending
   * @returns {Boolean}
   */

  isPending() {
    return WITHDRAWAL_PENDING(this.status);
  }

  /**
   * Checks if the latest withdrawal bundle hash is found.
   * @param {Hash} hash
   * @returns {Boolean}
   */

  async hasLatestWithdrawal(hash) {
    return this.db.getLatestWithdrawal(hash);
  }

  /**
   * Check the sidechain for the latest deposit.
   * @param {Deposit} hash
   * @returns {Boolean}
   */

  getLatestDeposit(hash) {
    return this.db.getLatestDeposit(hash);
  }
}

module.exports = WithdrawalBundle
