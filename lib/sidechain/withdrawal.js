/**
 * withdrawal.js - a withdrawal module for bip 300, 301 sidechains.
 * Copyright (c) 2023, Jonathan Joseph Gonzales Gutierrez (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const Amount = require('../btc/amount');
const Address = require('../primitives/address');
const common = require('../blockchain/common');
const consensus = require('../protocol/consensus');
const MTX = require('../primitives/mtx');
const Sidechain = require('./sidechain');
const {inspectSymbol} = require('../utils');

/*
 * Withdrawal Status
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

class Withdrawal extends Sidechain {

  /**
   * Create a withdrawal struct.
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.sidechain = common.THIS_SIDECHAIN;
    this.destination = new Address();
    this.refundAddress = new Address();
    this.amount = new Amount(consensus.CRITICAL_DATA_AMT);
    this.mainchainFee = new Amount(consensus.SIDECHAIN_DEPOSIT_FEE);
    this.status = withdrawalStatus.Unspent;
    this.blindTXHash = consensus.ZERO_HASH; // A Hash of the transaction minus the serialized output
  }

  compareMainchainFee(a, b) {
    return cmp(a, b);
  }

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


function cmp(a, b) {
  return a - b;
}

module.exports = Withdrawal;
