/*!
 * layout.js - mempool data layout for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const bdb = require('bdb');

/*
 * Database Layout:
 *   V -> db version
 *   v -> serialization version
 *   R -> tip hash
 *   e[hash] -> entry
 *   w[hash] -> withdrawalID
 */

const layout = {
  V: bdb.key('V'),
  v: bdb.key('v'),
  R: bdb.key('R'),
  F: bdb.key('F'),
  e: bdb.key('e', ['hash256']),
  w: bdb.key('w', ['hash256'])
};

/*
 * Expose
 */

module.exports = layout;
