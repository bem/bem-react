import React, { FC, ComponentType } from 'react'
import { mount } from 'enzyme'

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

type SizeAProps = {
  size?: 'a'
}

const Component: FC<BaseProps> = ({ children }) => <div>{children}</div>
const withHover = (Wrapped: ComponentType<any>) => (props: HoveredProps) => <Wrapped {...props} />
const withThemeA = (Wrapped: ComponentType<any>) => (props: ThemeAProps) => <Wrapped {...props} />
const withThemeB = (Wrapped: ComponentType<any>) => (props: ThemeBProps) => <Wrapped {...props} />
const withSizeA = (Wrapped: ComponentType<any>) => (props: SizeAProps) => <Wrapped {...props} />

const EnhancedComponent = compose(
  withHover,
  withSizeA,
  composeU(withThemeA, withThemeB),
)(Component)

describe('compose', () => {
  test('should compile component with theme a', () => {
    mount(<EnhancedComponent theme="b" text="" />)
  })

  test('should compile component with theme b', () => {
    mount(<EnhancedComponent theme="b" text="" />)
  })

  test('should compile component with hovered true', () => {
    mount(<EnhancedComponent hovered text="" />)
  })
})
