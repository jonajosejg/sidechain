/*!
 * layout.js - blockchain data layout for sidechain template
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * Copyright (c) 2023, Jonathan Gonzales
 * https://github.com/rojii/testchain
 */

'use strict';

const bdb = require('bdb');

/*
 * Database Layout:
 *   z[hash] -> unpsent withdrawal
 *   s[hash] -> spent withdrawal
 *   i[hash] -> input bundle withdrawal
 *   W[hash] -> withdrawal bundle output
 *   w -> withdrawal outpoint
 *   f -> failed withdrawal bundle
 *   o -> spent withdrawal bundle
 *   j -> deposit output
 *   Z[hash] -> created withdrawal bundle
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
  z: bdb.key('z', ['hash256']),
  s: bdb.key('s', ['hash256']),
  i: bdb.key('i', ['hash256', 'uint32']),
  W: bdb.key('W', ['hash256', 'uint32']),
  w: bdb.key('w'),
  f: bdb.key('f'),
  o: bdb.key('o', ['hash256']),
  j: bdb.key('j'),
  Z: bdb.key('Z', ['hash256']),
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
