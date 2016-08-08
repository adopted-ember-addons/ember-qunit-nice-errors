/*jshint node:true*/
'use strict';

var supportedAssertions = require('./supported-assertions.js');
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
  return isAssertionOfType(node, supportedAssertions.binary);
}

function isUnaryAssertion(node) {
  return isAssertionOfType(node, supportedAssertions.unary);
}

function isAssertionOfType(node, types) {
  return types.indexOf(node.callee.property.name) !== -1;
}

function buildMessage(node, options) {
  var str = recast.print(node).code;

  if (options && options.file) {
    str += ' at ' + location(node, options.file);
  }

  return str;
}

function addAssertionMessage(node, message) {
  node.arguments.push(builders.literal(message));
}

function replaceAssertionMessage(node, message) {
  if (needsMessage(node)) {
    addAssertionMessage(node, message);
  } else {
    node.arguments.pop();
    node.arguments.push(builders.literal(message));
  }
}

function appendAssertionMessage(node, message) {
  if (needsMessage(node)) {
    addAssertionMessage(node, message);
  } else {
    var newMessage = node.arguments.pop().value + ' - ' + message;
    node.arguments.push(builders.literal(newMessage));
  }
}

function processAssertion(node, options) {
  var message = buildMessage(node, options);

  if (options && options.completionMode === 'override') {
    replaceAssertionMessage(node, message);
  } else if (options && options.completionMode === 'append'){
    appendAssertionMessage(node, message);
  } else if (needsMessage(node)){
    addAssertionMessage(node, message);
  }
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
      } else if (isAssertion(node, assert)) {
        processAssertion(node, options);
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
