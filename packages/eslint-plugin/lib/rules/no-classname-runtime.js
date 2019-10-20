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
    function canOptimize(arg) {
      if (!arg) return false

      switch (arg.type) {
        case 'Literal':
        case 'Identifier':
          return true
        case 'MemberExpression':
          // Exception for this.props.x or this.state.x
          if (
            arg.object.type === 'ThisExpression' &&
            (arg.property.name === 'props' || arg.property.name === 'state')
          )
            return false

          // Exception for props.x or state.x (case for destructuring)
          if (
            arg.object.type === 'Identifier' &&
            (arg.object.name === 'props' || arg.object.name === 'state')
          )
            return false

          return canOptimize(arg.object) && canOptimize(arg.property)
        case 'Property':
          return canOptimize(arg.key) && canOptimize(arg.value)
        case 'ObjectExpression':
          return canOptimizeAllArguments(arg.properties)
        case 'ArrayExpression':
          return canOptimizeAllArguments(arg.elements)
        case 'ConditionalExpression':
          return canOptimizeAllArguments([arg.consequent, arg.alternate])
        case 'BinaryExpression':
        case 'LogicalExpression':
          return canOptimizeAllArguments([arg.left, arg.right])
        default:
          return false
      }
    }

    function canOptimizeAllArguments(args) {
      return [].concat(args).every(canOptimize)
    }

    function isOptimizableCallExpression(node) {
      return node.type === 'CallExpression' && canOptimizeAllArguments(node.arguments)
    }

    return {
      JSXAttribute: function(node) {
        const isEvaluatedClassName =
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'className' &&
          node.value.type === 'JSXExpressionContainer'

        if (!isEvaluatedClassName) return

        const expression = node.value.expression
        if (
          // className={cn('x')}
          isOptimizableCallExpression(expression) ||
          // className={isA ? cn('A') : cn('B')}
          (expression.type === 'ConditionalExpression' &&
            (isOptimizableCallExpression(expression.consequent) ||
              isOptimizableCallExpression(expression.alternate))) ||
          // className={isA && cn('A') || cn('B')} || className={isA ? cn('A') : cn('B')} ||
          ((expression.type === 'BinaryExpression' || expression.type === 'LogicalExpression') &&
            (isOptimizableCallExpression(expression.left) ||
              isOptimizableCallExpression(expression.right)))
        ) {
          context.report({
            node,
            message: "You can speed up your code if you don't call the function on every render",
          })
        }
      },
    }
  },
}
