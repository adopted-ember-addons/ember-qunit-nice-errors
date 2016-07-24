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
  return isAssertionOfType(node, ['equal', 'notEqual']);
}

function isUnaryAssertion(node) {
  return isAssertionOfType(node, ['ok', 'notOk']);
}

function isAssertionOfType(node, types) {
  return types.indexOf(node.callee.property.name) !== -1;
}

function addAssertionMessage(node, options) {
  var str = recast.print(node).code;
  var extra = '';

  if (options && options.file) {
    extra = ' at ' + location(node, options.file);
  }

  node.arguments.push(builders.literal(str + extra));
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

module.exports = function transform(source, options) {
  var ast = recast.parse(source);
  var assert = 'assert';

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;

      if (isTestCall(node)) {
        assert = assertName(node);
      } else if (isAssertion(node, assert) && needsMessage(node)) {
        addAssertionMessage(node, options);
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
