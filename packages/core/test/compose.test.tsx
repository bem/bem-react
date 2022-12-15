import React, { FC, ComponentType, ReactNode } from 'react'
import { render } from '@testing-library/react'

import { compose, composeU, createClassNameModifier, withBemMod } from '../core'

type BaseProps = {
  text: string
  children?: ReactNode
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

type SimpleProps = {
  simple?: 'somevalue' | 'errorvalue'
}

type SimpleBooleanProps = {
  isBoolean?: boolean
}

function expectAttrs(Component: React.ReactElement<any>, attrs: { [key: string]: string }) {
  const { container } = render(Component)
  const node = container.querySelector('*')
  for (const a in attrs) {
    expect(node?.getAttribute(a)).toEqual(attrs[a])
  }
}

const Component: FC<BaseProps> = ({ children }) => <div>{children}</div>
const ComponentSpreadProps: FC<BaseProps> = ({ children, ...props }) => {
  if (
    // @ts-ignore
    (props.hasOwnProperty('isBoolean') && props.isBoolean === undefined)
    // @ts-ignore
    || props.isBoolean === false
  ) {
    throw Error('props must be omitted')
  }

  return <div {...props}>{children}</div>
}
const withSimpleCompose = createClassNameModifier<SimpleProps>('EnhancedComponent', {
  simple: 'somevalue',
})

const withSimpleBooleanCompose = createClassNameModifier<SimpleBooleanProps>('EnhancedComponent', {
  isBoolean: true,
})

const withAutoSimpleCompose = withBemMod<{ autosimple?: 'yes' }>('EnhancedComponent', {
  autosimple: 'yes',
})

const withHover = (Wrapped: ComponentType<any>) => (props: HoveredProps) => <Wrapped {...props} />
const withThemeA = (Wrapped: ComponentType<any>) => (props: ThemeAProps) => <Wrapped {...props} />
const withThemeB = (Wrapped: ComponentType<any>) => (props: ThemeBProps) => <Wrapped {...props} />
const withSizeA = (Wrapped: ComponentType<any>) => (props: SizeAProps) => <Wrapped {...props} />

const EnhancedComponent = compose(
  withSimpleCompose,
  withAutoSimpleCompose,
  withHover,
  withSizeA,
  composeU(withThemeA, withThemeB),
)(Component)

const EnhancedComponentRemoveProp = compose(
  withSimpleCompose,
  withSimpleBooleanCompose,
  withAutoSimpleCompose,
  withHover,
  withThemeB,
)(ComponentSpreadProps)

describe('compose', () => {
  test('should compile component with theme a', () => {
    render(<EnhancedComponent theme="a" text="" />)
  })

  test('should compile component with theme b', () => {
    render(<EnhancedComponent theme="b" text="" />)
  })

  test('should compile component with hovered true', () => {
    render(<EnhancedComponent hovered text="" />)
  })

  test('should compile component with simple mod', () => {
    render(<EnhancedComponent theme="b" simple="somevalue" text="" autosimple="yes" />)
  })

  test('remove mod props in simple mod', () => {
    expectAttrs(
      <EnhancedComponentRemoveProp
        theme="b"
        simple="somevalue"
        text=""
        autosimple="yes"
        isBoolean
      />,
      {
        autosimple: 'yes',
        class:
          'EnhancedComponent EnhancedComponent_simple_somevalue EnhancedComponent_isBoolean EnhancedComponent_autosimple_yes',
        text: '',
        theme: 'b',
      },
    )
  })

  test('remove mod props in simple mod if boolean value', () => {
    expectAttrs(<EnhancedComponentRemoveProp text="" isBoolean={false} />, {
      class: 'EnhancedComponent',
      text: '',
    })
  })

  test("don't remove mod props in simple mod if value hasn't matched", () => {
    expectAttrs(
      <EnhancedComponentRemoveProp theme="b" simple="errorvalue" text="" isBoolean={undefined} />,
      {
        class: 'EnhancedComponent',
        simple: 'errorvalue',
        text: '',
        theme: 'b',
      },
    )
  })
})
