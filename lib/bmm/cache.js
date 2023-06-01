/**
 * cache.js - a cache module for bmm blocks.
 * Copyright (c) 2023, Jonathan Gonzales (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const assert = require('bsert');
const EventEmitter = require('events');
const {BufferMap, BufferSet} = require('buffer-map');

/**
 * Cache
 * A cache module that handles bmm blocks.
 * @alias module:BMM.Cache
 * @extends EventEmitter
 */

class BMMCache extends EventEmitter {
  /**
   * Create a BMM cache.
   * @constructor
   * @param {Object} options
   */

  constructor(options) {
    super();

    this.blockMap = new BufferSet();
    this.map = new BufferMap();
  }

  storeBlock(block) {
    assert(Buffer.isBuffer(block));

    if (block.length === 0)
      return false;

    const merkleRoot = block.merkleRoot();

    return this.map.set(merkleRoot);
  }

  getMainPrevBlock(hash) {
    assert(Buffer.isBuffer(hash));

    if (this.map.size < 2)
      return true;

    if (this.map.has(hash))
      return true;

    return hash
  }

  clear() {
    return this.map.clear();
  }
}


module.exports = BMMCache;
