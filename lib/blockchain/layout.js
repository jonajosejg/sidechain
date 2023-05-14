/*!
 * layout.js - blockchain data layout for testchain
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/rojii/sidechain
 */

'use strict';

const bdb = require('bdb');

/*
 * Database Layout:
 *   u[hash] -> upsent_withdrawal
 *   p[hash] -> in_bundle withdrawal
 *   s[hash] -> spent_withdrawal
 *   c[hash][index] -> created withdrwal_bundle
 *   f -> failed withdrawal_bundle
 *   o -> spent withdrawal_bundle
 *   D -> deposit_OP
 *   W -> withdrawal_OP
 *   P -> withdrawal_bundle_OP
 *   V -> db version
 *   O -> chain options
 *   R -> tip hash
 *   D -> versionbits deployments
 *   P[hash] Withdrawal Bundle
 *   s[hash] -> spent sidechain tx
 *   e[hash] -> entry
 *   h[hash] -> height
 *   H[height] -> hash
 *   n[hash] -> next hash
 *   p[hash] -> tip index
 *   b[hash] -> block (deprecated)
 *   t[hash] -> extended tx (deprecated)
 *   c[hash] -> coins
 *   u[hash] -> undo coins (deprecated)
 *   v[bit][hash] -> versionbits state
 *   T[addr-hash][hash] -> dummy (tx by address) (deprecated)
 *   C[addr-hash][hash][index] -> dummy (coin by address) (deprecated)
 */

const layout = {
  V: bdb.key('V'),
  O: bdb.key('O'),
  R: bdb.key('R'),
  D: bdb.key('D'),
  e: bdb.key('e', ['hash256']),
  h: bdb.key('h', ['hash256']),
  H: bdb.key('H', ['uint32']),
  n: bdb.key('n', ['hash256']),
  p: bdb.key('p', ['hash256']),
  b: bdb.key('b', ['hash256']),
  t: bdb.key('t', ['hash256']),
  v: bdb.key('v', ['uint8', 'hash256']),
  T: bdb.key('T', ['hash', 'hash256']),
  C: bdb.key('C', ['hash', 'hash256', 'uint32'])
};

/*
 * Expose
 */

module.exports = layout;
