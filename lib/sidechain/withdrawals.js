/**
 * withdrawals.js - a withdrawal bundle module for sidechains.
 * Copyright (c) 2023, Jonathan Gonzales (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const {Struct} = require('bufio');
const layout = require('../blockchain/layout');

/*
 * Constants
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

const UNSPENT_WITHDRAWAL = (s) => {
  return s === withdrawalStatus.FAILED;
};


const WITHDRAWAL_SPENT =  (s) => {
  return s === withdrawalStatus.SPENT;
}

const WITHDRAWAL_PENDING = (s) => {
  return s === withdrawalStatus.CREATED;
};



class WithdrawalBundle extends Struct {
  constructor(options) {
    super();

    this.status = withdrawalStatus.DEFAULT;

    if (options)
      this.fromOptions(options);
  }

  fromOptions(options) {
    if (options.status != null) {
      assert(status[options.status], 'Invalid status code');
      this.status = options.status;
    }

    return this;
  }

  fromJSON(json) {
    assert(json, 'Options are required.');

    this.status = json.statusCode;
    return this;
  }

  write(bw) {
    bw.writeU8(this.status);
    return bw;
  }

  read(br) {
    this.status = br.readU8();
    return this;
  }

  isUnspent() {
    return UNSPENT_WITHDRAWAL(this.status);
  }
  isSpent() {
    return WITHDRAWAL_SPENT(this.status);
  }

  isPending() {
    return WITHDRAWAL_PENDING(this.status);
  }
}

module.exports = WithdrawalBundle
