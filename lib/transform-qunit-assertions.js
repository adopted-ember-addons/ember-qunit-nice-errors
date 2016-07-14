/*jshint node:true*/
'use strict';

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
    node.arguments.push(builders.literal(prefix + str));
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

module.exports = function transform(source) {
  var ast = recast.parse(source);
  var assert = 'assert';

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;

      if (isTestCall(node)) {
        assert = assertName(node);
      } else if (isAssertion(node, assert, 'ok')) {
        transformUnaryAssertion(node, 'ok: ');
      } else if(isAssertion(node, assert, 'notOk')) {
        transformUnaryAssertion(node, 'not ok: ');
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
