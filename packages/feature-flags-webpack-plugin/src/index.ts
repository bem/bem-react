import { Expression, CallExpression, Identifier, SpreadElement } from 'estree'
import { Compilation, Compiler, javascript } from 'webpack'

type PluginOptions = {
  /**
   * Function name for match
   *
   * @default 'isFeatureEnabled'
   */
  isFeatureEnabledFnName?: string
  /**
   * Object with flags
   */
  flags: Record<string, any>
}

class FeatureFlagsWebpackPlugin {
  constructor(public options: PluginOptions) {
    this.options = Object.assign({ isFeatureEnabledFnName: 'isFeatureEnabled' }, this.options)
  }

  apply(compiler: Compiler) {
    const { isFeatureEnabledFnName, flags } = this.options as Required<PluginOptions>

    function onCallExpression(expression: Expression, parser: javascript.JavascriptParser) {
      if (isFeatureFlagFunction(expression, isFeatureEnabledFnName)) {
        const argument = expression.arguments[0]
        if (isIdentifier(argument)) {
          const isEnabled = flags[argument.name] !== undefined
          const result = isEnabled ? parser.evaluate(true) : parser.evaluate(false)
          if (result !== undefined) {
            result.setRange(expression.range)
          }
          return result
        }
      }
      return undefined
    }

    function onParseJavascript(parser: javascript.JavascriptParser) {
      parser.hooks.evaluate
        .for('CallExpression')
        .tap('FeatureFlagsWebpackPlugin', (expression) => onCallExpression(expression, parser))
    }

    function onThisCompilation(_compilation: Compilation, compilationParams: any) {
      compilationParams.normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap('FeatureFlagsWebpackPlugin', onParseJavascript)
    }

    compiler.hooks.thisCompilation.tap('FeatureFlagsWebpackPlugin', onThisCompilation)
  }
}

function isFeatureFlagFunction(
  expression: Expression,
  isFeatureEnabledFnName: string,
): expression is CallExpression {
  // prettier-ignore
  return (
    expression.type === 'CallExpression'
    && expression.arguments.length > 0
    && expression.callee.type === 'Identifier'
    && expression.callee.name === isFeatureEnabledFnName
  )
}

function isIdentifier(expression: Expression | SpreadElement): expression is Identifier {
  return expression.type === 'Identifier'
}

export default FeatureFlagsWebpackPlugin
module.exports = FeatureFlagsWebpackPlugin
