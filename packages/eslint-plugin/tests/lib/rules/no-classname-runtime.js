'use strict'

const rule = require('../../../lib/rules/no-classname-runtime')
const { RuleTester } = require('eslint')

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

const ruleTester = new RuleTester()

ruleTester.run('no-classname-runtime', rule, {
  valid: [
    '<Block className="Time"/>',
    '<Block className={cnTest}/>',
    '<Block className={this.cnTest}/>',
    '<Block className={isVisible ? "Visible" : Hidden}/>',
    '<Block className={cnTest(this.props.className)}/>',
    '<Block className={cnTest(undefined, [this.props.className])}/>',
    '<Block className={cnTest({ [props.type]: true })}/>',
    '<Block className={cnTest({ [props.type]: a.b.c.d })}/>',
  ].map((code) => ({
    code,
  })),

  invalid: [
    '<Block className={cnTest()}/>',
    '<Block className={cnTest("Test")}/>',
    '<Block className={cnTest("Test", "TestElem")}/>',
    '<Block className={cnTest({ theme })}/>',
    '<Block className={cnTest({ theme, colored })}/>',
    '<Block className={cnTest("Test", { theme })}/>',
    '<Block className={cnTest("Test", { params }, [mixClassName])}/>',
    '<Block className={cnTest("Test", null, [mixClassName])}/>',
    '<Block className={cnTest(null, [mixClassName])}/>',
    '<Block className={cnTest({ isVisible: a > b })}/>',
    '<Block className={isVisible ? cnTest("Visible") : cnTest("Hidden")}/>',
    '<Block className={isVisible && cnTest("Visible") || cnTest("Hidden")}/>',
    '<Block className={isVisible || cnTest("Hidden")} />',
  ].map((code) => ({
    code,
    errors: [
      {
        message: "You can speed up your code if you don't call the function on every render",
      },
    ],
  })),
})
