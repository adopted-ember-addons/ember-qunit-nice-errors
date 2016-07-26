/*jshint node:true*/
'use strict';

var supportedAssertions = require('./supported-assertions.js');
var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;

function isAssertion(node, assert, propertyName) {
  return types.MemberExpression.check(node.callee) &&
    node.callee.object.name === assert &&
    node.callee.property.name === propertyName;
}

function transformUnaryAssertion(node, prefix) {
  if (node.arguments.length === 1) {
    var arg1 = node.arguments[0];
    var str = recast.print(arg1).code;
    node.arguments.push(builders.literal(prefix + ' ' + str));
  }
}

function transformBinaryAssertion(node, prefix, op) {
  if (node.arguments.length === 2) {
    var arg1 = node.arguments[0];
    var arg2 = node.arguments[1];
    var str = recast.print(arg1).code + ' ' + op + ' ' + recast.print(arg2).code;
    node.arguments.push(builders.literal(prefix + ' ' + str));
  }
}

function isTestCall(node) {
  return types.Identifier.check(node.callee) &&
    node.callee.name === 'test';
}

function assertName(node) {
  var func = node.arguments[1];

  if (types.FunctionExpression.check(func) && func.params.length > 0) {
    return func.params[0].name;
  }
}

function transformOperation(node, assertion) {
  var type  = supportedAssertions[assertion].type;
  var msg  = supportedAssertions[assertion].message;

  if (type === 'unary') {
    transformUnaryAssertion(node, msg);
  } else if (type === 'binary') {
    var operator  = supportedAssertions[assertion].operator;
    transformBinaryAssertion(node, msg, operator);
  }
}

module.exports = function transform(source) {
  var ast = recast.parse(source);
  var assert = 'assert';

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;

      if (isTestCall(node)) {
        assert = assertName(node);
      } else {
        Object.keys(supportedAssertions).forEach(function(assertion){
          if (isAssertion(node, assert, assertion)) {
            transformOperation(node, assertion);
          }
        });
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
