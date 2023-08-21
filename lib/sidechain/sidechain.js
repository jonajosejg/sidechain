/**
 * sidechain.js - a sidechain module for bip300, bip301 sidechains.
 * Copyright (c) 2023, Jonathan Joseph Gonzales Gutierrez
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const common = require('../blockchain/common');
const layout = require('../blockchain/layout');
const Script = require('../script/script');
const {inspectSymbol} = require('../utils');


/**
 * Base object for sidechain related entries
 * @alias module:sidechain.Sidechain
 * @property {Number} sidechain
 * @property {Script} script
 * @property {Buffer} type
 */

class Sidechain {
  constructor(options) {
    this.sidechain = common.THIS_SIDECHAIN;
    this.script = new Script();

    if (options)
      this.fromOptions(options);
  }

  getScript(hash) {
    assert(Buffer.isBuffer(hash));
    return this.script.fromSidechainObj(hash);
  }

  [inspectSymbol]() {
    return '<Sidechain:'
     +   ` sidechain=${this.sidechain}`
     +   ` script=${this.script.toString()}`
     +   ` >`;

  }
}


module.exports = Sidechain;
