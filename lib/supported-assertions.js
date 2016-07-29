/*jshint node:true*/
'use strict';

module.exports = {
  ok: {
    message: 'ok:',
    type: 'unary'
  },

  notOk: {
    message: 'not ok:',
    type: 'unary'
  },

  equal: {
    message: 'equal:',
    type: 'binary',
    operator: '=='
  },

  notEqual: {
    message: 'not equal:',
    type: 'binary',
    operator: '!='
  },

  deepEqual: {
    message: 'deep equal:',
    type: 'binary',
    operator: '==='
  },

  notDeepEqual: {
    message: 'not deep equal:',
    type: 'binary',
    operator: '!=='
  },

  propEqual: {
    message: 'prop equal:',
    type: 'binary',
    operator: '==='
  },

  notPropEqual: {
    message: 'not prop equal:',
    type: 'binary',
    operator: '!=='
  },

  strictEqual: {
    message: 'strict equal:',
    type: 'binary',
    operator: '==='
  },

  notStrictEqual: {
    message: 'not strict equal:',
    type: 'binary',
    operator: '!=='
  }
};
