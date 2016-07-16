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

function transformUnaryAssertion(node, loc) {
  if (node.arguments.length === 1) {
    var str = recast.print(node).code;
    node.arguments.push(builders.literal(str + " " + loc));
  }
}

function transformBinaryAssertion(node, loc) {
  if (node.arguments.length === 2) {
    var str = recast.print(node).code;
    node.arguments.push(builders.literal(str + " " + loc));
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

module.exports = function transform(sourcePath, source) {
  var ast = recast.parse(source);
  var assert = 'assert';

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;
      var loc = sourcePath + ":" + node.loc.start.line + ":" + node.loc.start.column;

      if (isTestCall(node)) {
        assert = assertName(node);
      } else if (isAssertion(node, assert, 'ok')) {
        transformUnaryAssertion(node, loc);
      } else if(isAssertion(node, assert, 'notOk')) {
        transformUnaryAssertion(node, loc);
      } else if(isAssertion(node, assert, 'equal')){
        transformBinaryAssertion(node, loc);
      }

      this.traverse(path);
    }
  });

  return recast.print(ast, {quote: 'single'}).code;
};
