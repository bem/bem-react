import React from 'react'
import { assert } from 'chai'
import { describe, it } from 'mocha'
import { ComponentType } from 'react'
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

type TypeLinkProps = {
  type?: 'link'
  href?: string
}

type TypeSubmitProps = {
  type?: 'submit'
  action?: string
}

const BaseComponent = (props: BaseProps) => null
const hoveredComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: HoveredProps) => null
const themeAComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: ThemeAProps) => null
const themeBComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: ThemeBProps) => null
const typeLinkComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: TypeLinkProps) => null
const typeSubmitComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: TypeSubmitProps) => null

const EnhancedComponent = compose(
  hoveredComponent,
  composeU(themeAComponent, themeBComponent),
  composeU(typeLinkComponent, typeSubmitComponent),
)(BaseComponent)

describe('compose', () => {
  it('should compile component with theme a', () => {
    ;<EnhancedComponent theme="a" text="" />
    assert(true)
  })

  it('should compile component with theme b', () => {
    ;<EnhancedComponent theme="b" text="" />
    assert(true)
  })

  it('should compile component with conditional theme', () => {
    ;<EnhancedComponent theme={true ? 'b' : 'a'} text="" />
    assert(true)
  })

  it('should compile component with hovered true', () => {
    ;<EnhancedComponent hovered text="" />
    assert(true)
  })

  it('should compile component with type link and href', () => {
    ;<EnhancedComponent type="link" href="" text="" />
    assert(true)
  })

  it('should compile component with type submit and action', () => {
    ;<EnhancedComponent type="submit" action="" text="" />
    assert(true)
  })

  it.skip('should not compile component with type submit and href', () => {
    // typings:expect-error
    // ;<EnhancedComponent type="submit" href="" text="" />
    assert(true)
  })
})
