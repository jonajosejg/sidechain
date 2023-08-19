/*!
 * layout.js - blockchain data layout for sidechain template
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * Copyright (c) 2023, Jonathan Jose Gonzales Gutierrez
 * https://github.com/rojii/testchain
 */

'use strict';

const bdb = require('bdb');

/*
 * Database Layout:
 *   z -> unspent withdrawal status
 *   f -> failed withdrawal status
 *   s -> spent withdrawal status
 *   Z -> Unspent WithdrawalBundle status
 *   F -> Failed WithdrawalBundle status
 *   S -> Spent WithdrawalBundle status
 *   B[hash] -> Created Withdrawal Bundle
 *   L[hash] -> Latest sidechain deposit hash
 *   W[hash] -> latest withdrawal bundle outpoint
 *   w[hash][index] -> Withdrawal Outpoint
 *   d[hash][index] -> Deposit Outpoint
 *   I -> input withdrawal bundle
 *   V -> db version
 *   O -> chain options
 *   R -> tip hash
 *   D -> versionbits deployments
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
  // Sidechain Template Layout
  z: bdb.key('z'),
  f: bdb.key('f'),
  s: bdb.key('s'),
  Z: bdb.key('Z'),
  F: bdb.key('F'),
  S: bdb.key('S'),
  B: bdb.key('B', ['hash256']),
  L: bdb.key('L', ['hash256']),
  W: bdb.key('W', ['hash256']),
  w: bdb.key('w', ['hash256', 'uint32']),
  d: bdb.key('d', ['hash256', 'uint32']),
  I: bdb.key('I'),

  // Original ChainDB layout
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
  c: bdb.key('c', ['hash256', 'uint32']),
  u: bdb.key('u', ['hash256']),
  v: bdb.key('v', ['uint8', 'hash256']),
  T: bdb.key('T', ['hash', 'hash256']),
  C: bdb.key('C', ['hash', 'hash256', 'uint32'])
};

/*
 * Expose
 */

module.exports = layout;
