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

  set(hash) {
    assert(Buffer.isBuffer(hash));
    return this.map.set(hash);
  }

  get(hash) {
    assert(Buffer.isBuffer(hash));
    return this.map.get(hash);
  }

  /**
   * Test whether the hash exits .
   * @param {Hash} hash
   * @returns {Boolean}
   */

  has(hash) {
    const entry = this.map.get(hash);

    if (!entry)
      return false;

    return entry.equals(hash);
  }
}


module.exports = BMMCache;
