import { Plugin, Compiler } from 'webpack'

const featureFlagsFunctionName = 'isFeatureEnabled'

function isFeatureFlagFunction(expression: any) {
  if (expression.callee.property) {
    return expression.callee.property.name === featureFlagsFunctionName
  }
  return expression.callee.name === featureFlagsFunctionName
}

function getFeatureProperties(expression: any) {
  if (!expression || !expression.arguments.length) return []
  return expression.arguments[0].properties
}

function getFeatureFlag(properties: any) {
  return properties.reduce((result: any, property: any) => {
    const key = property.key.name
    const value = property.value.value
    result[key] = value
    return result
  }, {})
}

function isEnabledFlag(flag: any, options: any) {
  return options.some(
    (option: any) => option.value === flag.value && option.component === flag.component,
  )
}

class FeatureFlagsWebpackPlugin extends Plugin {
  options: any[]

  constructor(options: any[]) {
    super()
    this.options = options || []
  }

  apply(compiler: Compiler) {
    const options = this.options

    compiler.hooks.thisCompilation.tap(
      'FeatureFlagsWebpackPlugin',
      (_, { normalModuleFactory }) => {
        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap('FeatureFlagsWebpackPlugin', (parser) => {
            // @ts-expect-error
            const getTrue = () => parser.evaluate(true)
            // @ts-expect-error
            const getFalse = () => parser.evaluate(false)

            parser.hooks.evaluate
              .for('CallExpression')
              .tap('FeatureFlagsWebpackPlugin', (expression) => {
                if (!isFeatureFlagFunction(expression)) return

                const properties = getFeatureProperties(expression)
                const flag = getFeatureFlag(properties)
                const isEnabled = isEnabledFlag(flag, options)
                const result = isEnabled ? getTrue() : getFalse()
                result.setRange(expression.range)
                return result
              })
          })
      },
    )
  }
}

module.exports = FeatureFlagsWebpackPlugin
