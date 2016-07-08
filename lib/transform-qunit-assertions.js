var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;

function isOkAssertion(node) {
  return node.callee.type === 'MemberExpression' &&
    node.callee.object.name === 'assert' &&
    node.callee.property.name === 'ok';
}

function transformOkAssertion(node) {
  if (node.arguments.length === 1) {
    arg1 = node.arguments[0];
    var str = recast.print(arg1).code;
    node.arguments.push(builders.literal('ok: ' + str));
  }
}

module.exports = function transform(source) {
  var ast = recast.parse(source);
  var okAssertions = [];

  recast.visit(ast, {
    visitCallExpression: function(path){
      var node = path.node;

      if(isOkAssertion(node)){
        okAssertions.push(node);
      }

      this.traverse(path);
    }
  });

  okAssertions.forEach(function(node){
    transformOkAssertion(node);
  });

  return recast.print(ast, {quote: 'single'}).code;
};
