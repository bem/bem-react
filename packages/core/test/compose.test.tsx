import React, { ComponentType } from 'react'

import { compose, composeU } from '../core'

type BaseProps = {
  text: string
}

type HoveredProps = {
  hovered?: boolean
}

type ThemeAProps = {
  theme?: 'a'
}

type ThemeBProps = {
  theme?: 'b'
}

const BaseComponent = (_props: BaseProps) => null
const hoveredComponent = <T extends any>(_Wrapped: ComponentType<T>) => (_props: HoveredProps) =>
  null
const themeAComponent = <T extends any>(_Wrapped: ComponentType<T>) => (_props: ThemeAProps) => null
const themeBComponent = <T extends any>(_Wrapped: ComponentType<T>) => (_props: ThemeBProps) => null

const EnhancedComponent = compose(
  hoveredComponent,
  composeU(themeAComponent, themeBComponent),
)(BaseComponent)

describe('compose', () => {
  test('should compile component with theme a', () => {
    <EnhancedComponent theme="b" text="" />
  })

  test('should compile component with theme b', () => {
    <EnhancedComponent theme="b" text="" />
  })

  test('should compile component with hovered true', () => {
    <EnhancedComponent hovered text="" />
  })
})
