import React from 'react'
import { render } from 'enzyme'

import { Registry, withRegistry, RegistryConsumer, useRegistries, useRegistry } from '../di'

describe('@bem-react/di', () => {
  describe('Registry', () => {
    test('should set components by id', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      expect(registry.get('id-1')).toEqual(Component1)
      expect(registry.get('id-2')).toEqual(Component2)
    })

    test('should fill components via object literal', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.fill({
        Component1,
        Component2,
      })

      const snapshot: any = {}
      snapshot.Component1 = Component1
      snapshot.Component2 = Component2

      expect(registry.snapshot()).toEqual(snapshot)
    })

    test('should return list of components', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      const snapshot = {
        'id-1': Component1,
        'id-2': Component2,
      }

      expect(registry.snapshot()).toEqual(snapshot)
    })

    test('should add/retrieve other values', () => {
      const registry = new Registry({ id: 'registry' })
      const functor = () => 'value'

      registry.set('id-1', 1).fill({ 'id-2': '2-string', 'id-3': functor })

      expect(registry.snapshot()).toEqual({
        'id-1': 1,
        'id-2': '2-string',
        'id-3': functor,
      })
    })

    test('should merge registries', () => {
      const baseRegistry = new Registry({ id: 'base' })
      const Component1 = () => null
      const Component2 = () => <span />

      baseRegistry.fill({ Component1, Component2 })

      const overrideRegistry = new Registry({ id: 'override' })
      const Component1Overwrite = () => <div />

      overrideRegistry.fill({ Component1: Component1Overwrite })

      const snapshot = {
        Component1: Component1Overwrite,
        Component2,
      }

      expect(baseRegistry.merge(overrideRegistry).snapshot()).toEqual(snapshot)
    })

    test('should not affect registry in merge with undefined', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      const snapshot = {
        'id-1': Component1,
        'id-2': Component2,
      }

      // @ts-ignore to check inside logic
      expect(registry.merge().snapshot()).toEqual(snapshot)
    })

    test("should throw error when component doesn't exist", () => {
      const registry = new Registry({ id: 'registry' })

      expect(() => registry.get('id')).toThrow("Entry with id 'id' not found.")
    })
  })

  describe('withRegistry', () => {
    describe('useRegistry', () => {
      test('should pull component from registry', () => {
        const registry = new Registry({ id: 'registry' })
        const Element: React.FC = ({ children }) => <span>{children}</span>

        registry.fill({ Element })

        const AppPresenter: React.FC = ({ children }) => {
          const { Element } = useRegistry('registry')

          return <Element>{children}</Element>
        }

        const App = withRegistry(registry)(AppPresenter)

        expect(render(<App children="content" />).text()).toEqual('content')
      })
    })

    describe('useRegistries', () => {
      test('should pull components from different registries', () => {
        const registry1 = new Registry({ id: 'registry1' })
        const registry2 = new Registry({ id: 'registry2' })
        const Element1 = () => <span>content-1</span>
        const Element2 = () => <span>content-2</span>

        registry1.fill({ Element1 })
        registry2.fill({ Element2 })

        const AppPresenter: React.FC = () => {
          const { registry1, registry2 } = useRegistries()
          const { Element1 } = registry1.snapshot()
          const { Element2 } = registry2.snapshot()

          return (
            <>
              <Element1 />
              <Element2 />
            </>
          )
        }

        const App = withRegistry(registry1, registry2)(AppPresenter)

        expect(render(<App />).text()).toEqual('content-1content-2')
      })
    })

    describe('RegistryConsumer', () => {
      test('should pull component from registry', () => {
        const registry = new Registry({ id: 'registry' })
        const Element: React.FC = ({ children }) => <span>{children}</span>

        registry.fill({ Element })

        const AppPresenter: React.FC = ({ children }) => (
          <RegistryConsumer id="registry">
            {({ Element }) => <Element>{children}</Element>}
          </RegistryConsumer>
        )

        const App = withRegistry(registry)(AppPresenter)

        expect(render(<App children="content" />).text()).toEqual('content')
      })
    })

    describe('overwrite', () => {
      test('should overwrite component in registry', () => {
        const baseRegistry = new Registry({ id: 'registry' })
        const overwriteRegistry = new Registry({ id: 'registry' })
        const Element = () => <span>content</span>
        const ElementOverwritten = () => <span>overwritten</span>

        baseRegistry.fill({ Element })
        overwriteRegistry.fill({ Element: ElementOverwritten })

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">{({ Element }) => <Element />}</RegistryConsumer>
        )

        const App = withRegistry(overwriteRegistry, baseRegistry)(AppPresenter)

        expect(render(<App />).text()).toEqual('overwritten')
      })

      test('should partially overwrite components in registry', () => {
        const baseRegistry = new Registry({ id: 'registry' })
        const overwriteRegistry = new Registry({ id: 'registry' })
        const Element = () => <span>content</span>
        const ElementOverwritten = () => <span>overwritten</span>
        const Extra = () => <span>extra</span>

        baseRegistry.fill({ Element, Extra })
        overwriteRegistry.fill({ Element: ElementOverwritten })

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">{({ Element }) => <Element />}</RegistryConsumer>
        )

        const App = withRegistry(overwriteRegistry, baseRegistry)(AppPresenter)

        expect(render(<App />).text()).toEqual('overwritten')
      })
    })

    describe('extend', () => {
      test('should extend component in registry', () => {
        const baseRegistry = new Registry({ id: 'registry' })
        const extendedRegistry = new Registry({ id: 'registry' })
        const superExtendedRegistry = new Registry({ id: 'registry' })
        const Element: React.FC = () => <span>content</span>

        baseRegistry.fill({ Element })
        extendedRegistry.extends<React.FC>('Element', (Base) => () => (
          <div>
            extended <Base />
          </div>
        ))
        superExtendedRegistry.extends<React.FC>('Element', (Base) => () => (
          <div>
            super <Base />
          </div>
        ))

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">{({ Element }) => <Element />}</RegistryConsumer>
        )

        const App = withRegistry(baseRegistry)(AppPresenter)
        const AppExtended = withRegistry(extendedRegistry)(App)
        const AppSuperExtended = withRegistry(superExtendedRegistry)(AppExtended)

        expect(render(<App />).text()).toEqual('content')
        expect(render(<AppExtended />).text()).toEqual('extended content')
        expect(render(<AppSuperExtended />).text()).toEqual('super extended content')
      })

      test('should partially extend components in registry', () => {
        const baseRegistry = new Registry({ id: 'registry' })
        const extendedLeftRegistry = new Registry({ id: 'registry' })
        const extendedRightRegistry = new Registry({ id: 'registry' })
        const Left: React.FC = () => <span>left</span>
        const Right: React.FC = () => <span>right</span>
        const Extension = (Base: React.FC) => () => (
          <div>
            extended <Base />
          </div>
        )

        baseRegistry.fill({ Left, Right })
        extendedLeftRegistry.extends<React.FC>('Left', Extension)
        extendedRightRegistry.extends<React.FC>('Right', Extension)

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">
            {({ Left, Right }) => (
              <>
                <Left />
                <Right />
              </>
            )}
          </RegistryConsumer>
        )

        const App = withRegistry(baseRegistry)(AppPresenter)
        const AppExtended = withRegistry(extendedLeftRegistry, extendedRightRegistry)(App)

        expect(render(<App />).text()).toEqual('leftright')
        expect(render(<AppExtended />).text()).toEqual('extended leftextended right')
      })

      test('should extend other values in registry', () => {
        const baseRegistry = new Registry({ id: 'registry' }).fill({
          prop: 'foo',
          functionProp: () => 'bar',
        })
        const extendedRegistry = new Registry({ id: 'registry' })
        extendedRegistry.extends('prop', (Base) => `extended ${Base}`)
        extendedRegistry.extends<() => String>('functionProp', (Base) => () => `extended ${Base()}`)

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">
            {({ prop, functionProp }) => (
              <div>
                {prop} / {functionProp()}
              </div>
            )}
          </RegistryConsumer>
        )

        const App = withRegistry(baseRegistry)(AppPresenter)
        const AppExtended = withRegistry(extendedRegistry)(App)

        expect(render(<App />).text()).toEqual('foo / bar')
        expect(render(<AppExtended />).text()).toEqual('extended foo / extended bar')
      })

      test('should not influence adjacent context', () => {
        const registry = new Registry({ id: 'registry' })
        const otherRegistryExtended = new Registry({ id: 'other-registry' })
        const Element: React.FC = () => <span>content</span>

        registry.fill({ Element })
        otherRegistryExtended.extends<React.FC>('Element', (Base) => () => (
          <div>
            extended <Base />
          </div>
        ))

        const AppPresenter: React.FC = () => (
          <RegistryConsumer id="registry">{({ Element }) => <Element />}</RegistryConsumer>
        )

        const App = withRegistry(otherRegistryExtended, registry)(AppPresenter)

        expect(render(<App />).text()).toEqual('content')
      })
    })
  })
})
