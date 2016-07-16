/*jshint node:true*/
'use strict';

var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;

function isAssertion(node, assert) {
  return types.MemberExpression.check(node.callee) &&
    node.callee.object.name === assert;
}

function needsMessage(node) {
  var argumentCount = node.arguments.length;

  return isUnaryAssertion(node) && argumentCount === 1 ||
    isBinaryAssertion(node) && argumentCount === 2;
}

function isBinaryAssertion(node) {
  return node.callee.property.name === 'equal';
}

function isUnaryAssertion(node) {
  return ['ok', 'notOk'].indexOf(node.callee.property.name) !== -1;
}

function addAssertionMessage(node, filePath) {
  var str = recast.print(node).code;
  var loc = location(node, filePath);

  node.arguments.push(builders.literal(str + " at " + loc));
}

function location(node, filePath) {
  return filePath + ":" + node.loc.start.line + ":" + node.loc.start.column;
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

module.exports = function transform(sourcePath, source) {
  var ast = recast.parse(source);
  var assert = 'assert';

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;

      if (isTestCall(node)) {
        assert = assertName(node);
      } else if (isAssertion(node, assert) && needsMessage(node)) {
        addAssertionMessage(node, sourcePath);
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
