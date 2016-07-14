/*jshint node:true*/
'use strict';

var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;

function isOkAssertion(node, assert) {
  return types.MemberExpression.check(node.callee) &&
    node.callee.object.name === assert &&
    node.callee.property.name === 'ok';
}

function transformOkAssertion(node) {
  if (node.arguments.length === 1) {
    var arg1 = node.arguments[0];
    var str = recast.print(arg1).code;
    node.arguments.push(builders.literal('ok: ' + str));
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
      } else if(isOkAssertion(node, assert)){
        transformOkAssertion(node);
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
