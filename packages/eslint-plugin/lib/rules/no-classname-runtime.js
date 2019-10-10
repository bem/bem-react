'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Do not use the @bem-react/classname function in runtime code',
      category: 'perf',
      recommended: true,
    },
  },

  create: function(context) {
    function isCanBeSimplified(arg) {
      if (arg && (arg.type === 'Literal' || arg.type === 'Identifier')) return true

      if (arg.type === 'MemberExpression') {
        // Exception for this.props.x or this.state.x
        if (
          arg.object.type === 'ThisExpression' &&
          (arg.property.name === 'props' || arg.property.name === 'state')
        )
          return false

        return isCanBeSimplified(arg.object) && isCanBeSimplified(arg.property)
      }

      if (arg.type === 'Property') {
        return isCanBeSimplified(arg.key) && isCanBeSimplified(arg.value)
      }

      if (arg.type === 'ObjectExpression') {
        return isCanBeSlow(arg.properties)
      }

      if (arg.type === 'ArrayExpression') {
        return isCanBeSlow(arg.elements)
      }

      if (arg.type === 'ConditionalExpression') {
        return isCanBeSlow([arg.consequent, arg.alternate])
      }

      if (arg.type === 'BinaryExpression' || arg.type === 'LogicalExpression') {
        return isCanBeSlow([arg.left, arg.right])
      }

      return false
    }

    function isCanBeSlow(args, dbg) {
      return [].concat(args).every(isCanBeSimplified)
    }

    function isCallExpression(node) {
      if (node.type === 'CallExpression' && isCanBeSlow(node.arguments)) {
        return true
      }

      return false
    }

    return {
      JSXAttribute: function(node) {
        const isEvaluatedClassName =
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'className' &&
          node.value.type === 'JSXExpressionContainer'

        if (isEvaluatedClassName) {
          const expression = node.value.expression
          if (
            // className={cn('x')}
            isCallExpression(expression) ||
            // className={isA ? cn('A') : cn('B')}
            (expression.type === 'ConditionalExpression' &&
              (isCallExpression(expression.consequent) ||
                isCallExpression(expression.alternate))) ||
            // className={isA && cn('A') || cn('B')} || className={isA ? cn('A') : cn('B')} ||
            ((expression.type === 'BinaryExpression' || expression.type === 'LogicalExpression') &&
              (isCallExpression(expression.left) || isCallExpression(expression.right)))
          ) {
            context.report({
              node: node.parent,
              message: "You can speed up your code if you don't call the function on every render",
            })
          }
        }
      },
    }
  },
}
