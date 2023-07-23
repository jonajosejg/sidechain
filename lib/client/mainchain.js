/**
 * mainchain.js - client for interracting with the mainchain rpc.
 * https://github.com/rojii/sidechain
 * Copyright (C) 2023, Jonathan Gonzales (MIT License)
 */

'use strict';

const assert = require('bsert');
const {Client} = require('bcurl');
const Network = require('../protocol/network');
const common = require('../blockchain/common');
const network = Network.get('regtest');

/**
 * MainchainClient
 * @alias module:node.MainchainClient
 */

class MainchainClient extends Client {
  /**
   * Create a client that interracts with the
   * mainchain rpc daemon.
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.opened = false;

    this.options = new MainchainOptions(options);
    this.network = this.options.network;
    this.port = this.options.port;
    this.host = this.options.host;
    this.socket.port = this.options.port;
    this.headers = this.options.headers;
    this.username = this.options.username;
    this.password = this.options.password;

  }

  async open() {
    return this.open()
  }

  /**
   * Broadcasts the Withdrawal Bundle hash to the mainchain
   * @returns {Promise}
   */

  async broadcastWithdrawalBundle(sidechain, hash) {
    assert(typeof hash === 'string' && hash.length === 64);
    return this.execute('/', 'receivewithdrawalbundle', [sidechain, hash])
  }

  /**
   * Verify the BMM block hash proof from the mainchain
   * @returns {Promise}
   */

  async verifyBMMM(hashMainBlock, hashBMM, sidechain) {
    assert(typeof hashMainBlock === 'string' && hashMainBlock.length === 64);
    assert(typeof hashBMM === 'string' && hashBMM.length === 64);
    assert(sidechain >= 0);
    return this.execute('/', 'verifybmm', [hashMainBlock, hashBMM, sidechain])
  }

  /**
   * Get some info on the mainchain node (network).
   * @returns {Promise}
   */

  async getMainchainInfo() {
    return this.execute('/', 'getblockchaininfo', [])
  }

  /**
   * Retrieve the block hash on the mainchain daemon
   * by block height number.
   * @returns {Promise}
   */

  async getMainchainBlockHash(height) {
    assert(typeof height === 'number');
    return this.execute('/', 'getblockhash', [height])
  }

  async getSidechainTip(num) {
    assert(typeof num === 'number');
    return this.execute('/', 'listsidechainctip', [num])
  }

  /**
   * Retrieves the amount of blocks on the mainchain
   * @returns {Promise}
   */

  getBlockCount() {
    return this.execute('/', 'getblockcount', [])
  }

  /**
   * Checks if the current withdrawal bundle hash
   * is spent on the mainchain.
   * @returns {Promise}
   */

  hasSpentWithdrawal(hash, sidechain) {
    assert(typeof hash === 'string' && hash.length === 64);
    assert(sidechain >= 0);
    return this.execute('/', 'havespentwithdrawal', [hash, sidechain]);
  }

  /**
   * Checks if the withdrawal bundle hash has failed
   * on the mainchain.
   * @returns {Promise}
   */

  hasFailedWithdrawal(hash, sidechain) {
    assert(typeof hash === 'string' && hash.length === 64);
    assert(sidechain >= 0);
    return this.execute('/', 'havefailedwithdrawal', [hash, sidechain]);
  }

  /**
   * Retrieves the workscore / ack for a withdrawalbundle hash
   * @returns {Promise}
   */

  getWorkScore(sidechain, hash) {
    assert(typeof sidechain === 'number');
    assert(typeof hash === 'string');

    return this.execute('/', 'getworkscore', [sidechain, hash])
  }

  /**
   * Retrieves average fee amount for most recent mainchain blocks.
   * @returns {Promise}
   */

  getAverageMainchainFees(blocks) {
    assert(typeof blocks === 'number');
    return this.execute('/', 'getaveragefee', [blocks])
  }

  /**
   * For now this call only checks to see if there
   * are any WithdrawalBundles(s) for nSidechain.
   * The results could be useful for a GUI.
   */

  async getWithdrawalBundleStatus(sidechain) {
    assert(sidechain >= 0);
    return this.execute('/', 'listwithdrawalstatus', [sidechain])
  }

  async close() {
    return this.close();
  }
}

class MainchainOptions {
  /**
   * MainchainOptions
   * @alias module:node.MainchainOptions
   * @constructor
   * @param {Object} options
   */

  constructor(options) {

    this.options = options;
    this.network = network;
    this.port = network.mainchainPort;
    this.headers = {'Content-Type': 'application/json'};
    this.host = 'localhost';
    this.username = 'user';
    this.password = 'password';

    if (options)
      this.fromOptions(options);
  }

  /**
   * Inject properties from object.
   * @private
   * @param {Object} options
   * @returns {MainchainOptions}
   */

  fromOptions(options) {
    assert(options);

    this.host = options.host;
    this.port = options.port;
    this.headers = options.headers;
    this.network = options.network;

    if (options.host != null) {
      assert(typeof options.host === 'string');
      this.host = options.host;
    }

    if (options.port != null) {
      assert(typeof options.port === 'number');
      this.port = options.port;
    }

    if (options.network != null) {
      assert(typeof options.network === 'object');
      this.network = options.network;
    }

    return this;
  }

  /**
   * Instantiate http options from object.
   * @param {Object} options
   * @returns {MainchainOptions}
   */

  static fromOptions(options) {
    return new this().fromOptions(options);
  }
}

module.exports = MainchainClient;
