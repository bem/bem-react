'use strict'

const rule = require('../../../lib/rules/whitelist-levels-imports')
const { RuleTester } = require('eslint')

RuleTester.setDefaultConfig({
  parserOptions: {
    sourceType: 'module',
  },
})

const ruleTester = new RuleTester()

const filename = '/home/user/components/Link/Link@desktop.tsx'

const options = [
  {
    defaultLevel: 'common',
    whiteList: {
      common: ['common'],
      desktop: ['common', 'desktop'],
      mobile: ['common', 'mobile'],
    },
  },
]

ruleTester.run('whitelist-levels-imports', rule, {
  valid: [
    'import "./styles.scss"',
    'import "./styles@common.scss"',
    'import "./styles@desktop.scss"',
    'import * as keyset from "../i18n"',
    'import { ILinkProps } from "."',
    'import { ILinkProps } from ".."',
    'import React from "react"',
    'import Link from "@int/components"',
    'import { Link } from "./Link"',
    'import { Link } from "./Link@common"',
    'import { Link } from "./Link@desktop"',
    'import { Link } from "./Link@desktop.examples"',
    'import { registry } from "./registry/desktop"',
    // There is no way to determine that 'unknown' is a redefinition level
    'import { registry } from "./registry/unknown"',
  ].map((code) => ({
    code,
    options,
    filename,
  })),

  invalid: [
    {
      code: 'import "./styles@mobile.scss"',
      errors: [
        {
          message: "Imports from 'mobile' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import "./styles@unknown.scss"',
      errors: [
        {
          message: "Imports from 'unknown' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import { registry } from "./registry/mobile"',
      errors: [
        {
          message: "Imports from 'mobile' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import { Link } from "./Link@mobile"',
      errors: [
        {
          message: "Imports from 'mobile' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import { Link } from "./Link@unknown"',
      errors: [
        {
          message: "Imports from 'unknown' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: 'import { Link } from "./Link@mobile.examples"',
      errors: [
        {
          message: "Imports from 'mobile' level in files from 'desktop' level are forbidden",
          type: 'ImportDeclaration',
        },
      ],
    },
  ].map((item) => ({
    ...item,
    options,
    filename,
  })),
})
