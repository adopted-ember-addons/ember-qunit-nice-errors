/* jshint node: true */
var assertions = require('./supported-assertions.js');
var generate = require('babel-core/lib/generation');

/**
 * Babel Plugin to transform QUnit assertions in tests
 *
 * @param {Object} babel - Babel instance
 * @return {Object} Babel visitor
 */
module.exports = function(options) {
  return function (babel) {
    var types = babel.types;

    function isTestCall(node) {
      return types.isIdentifier(node.callee, { name: 'test' });
    }

    function assertArgumentName(node) {
      var func = node.arguments[1];

      if (types.isFunctionExpression(func) && func.params.length > 0) {
        return func.params[0].name;
      }
    }

    function isAssertion(node, assert) {
      var callee = node.callee;

      return types.isMemberExpression(callee) && callee.object.name === assert;
    }

    function needsMessage(node) {
      var argumentCount = node.arguments.length;

      return options.completeExistingMessages ||
        isUnaryAssertion(node) && argumentCount === 1 ||
        isBinaryAssertion(node) && argumentCount === 2;
    }

    function isBinaryAssertion(node) {
      return assertions[node.callee.property.name] === 'binary';
    }

    function isUnaryAssertion(node) {
      return assertions[node.callee.property.name] === 'unary';
    }

    function buildMessage(node) {
      return types.literal(generate(node).code);
    }

    function addAssertionMessage(node) {
      var message = buildMessage(node);

      if (options.completeExistingMessages) {
        node.arguments.pop();
      }

      node.arguments.push(message);
    }

    var rewriteAssertionVisitor = {
      CallExpression: function(node, parent, scope, state) {

        if (isAssertion(node, state.assertArgumentName) && needsMessage(node)) {
          addAssertionMessage(node);
        }
      }
    };

    return new babel.Plugin('rewrite-qunit-assertions', {
      visitor: {
        CallExpression: function(node, parent, scope) {
          var argName;

          if (isTestCall(node)) {
            argName = assertArgumentName(node);

            if(argName) {
              babel.traverse(node, rewriteAssertionVisitor, scope, { assertArgumentName: argName });
            }
          }
        }
      }
    });
  };
};
