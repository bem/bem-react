import React from 'react'
import { render } from 'enzyme'

import { Registry, withRegistry, RegistryConsumer, useRegistries, useRegistry } from '../di'
import { compose } from '../../core/core'

interface ICommonProps {
  className?: string
}

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
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      const overrides = new Registry({ id: 'overrides' })
      const Component1Overrided = () => <div />

      overrides.set('id-1', Component1Overrided)

      const snapshot = {
        'id-1': Component1Overrided,
        'id-2': Component2,
      }

      expect(registry.merge(overrides).snapshot()).toEqual(snapshot)
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

    test('should call hoc when merge registries', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.fill({ 'id-1': Component1, 'id-2': Component2 })

      const overrides = new Registry({ id: 'overrides' })
      const hocResult: React.ComponentType = () => null

      overrides.extends('id-1', (_Base) => hocResult)

      const snapshot = {
        'id-1': hocResult,
        'id-2': Component2,
      }

      expect(registry.merge(overrides).snapshot()).toEqual(snapshot)
    })

    test("should throw error when component doesn't exist", () => {
      const registry = new Registry({ id: 'registry' })

      expect(() => registry.get('id')).toThrow("Entry with id 'id' not found.")
    })
  })

  describe('withRegistry', () => {
    test('should provide all props to wrapped component', () => {
      const registry = new Registry({ id: 'uniq-1' })
      const Element: React.FC = ({ children }) => <span>{children}</span>

      registry.fill({ Element })

      const View: React.FC = ({ children }) => {
        const { Element } = useRegistry('uniq-1')

        return <Element>{children}</Element>
      }

      const EnhancedView = withRegistry(registry)(View)

      expect(render(<EnhancedView children="content" />).text()).toEqual('content')
    })

    describe('consumer', () => {
      test('should provide registry with component', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element: React.FC<ICommonProps> = () => <span>content</span>

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => <Element />}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).toEqual('content')
      })

      test('should override components in registry by context', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element: React.FC<ICommonProps> = () => <span>content</span>

        const overridedCompositorRegistry = new Registry({ id: 'Compositor', overridable: false })
        const OverridedElement: React.FC<ICommonProps> = () => <span>overrided</span>

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element)
        overridedCompositorRegistry.set('Element', OverridedElement)

        const CompositorPresenter: React.FC<ICommonProps> = () => {
          const Content: React.FC<ICommonProps> = withRegistry(overridedCompositorRegistry)(() => (
            <RegistryConsumer id="Compositor">
              {({ Element }: ICompositorRegistry) => <Element />}
            </RegistryConsumer>
          ))

          return <Content />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).toEqual('overrided')
      })

      test('should override components in registry from top node', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element: React.FC<ICommonProps> = () => <span>content</span>

        const overridedCompositorRegistry = new Registry({ id: 'Compositor' })
        const OverridedElement: React.FC<ICommonProps> = () => <span>overrided</span>

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element)
        overridedCompositorRegistry.set('Element', OverridedElement)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => <Element />}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(render(<Compositor />).text()).toEqual('content')
        expect(render(<OverridedCompositor />).text()).toEqual('overrided')
      })

      test('should partially override components in registry', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element1: React.FC<ICommonProps> = () => <span>content</span>
        const Element2: React.FC<ICommonProps> = () => <span>extra</span>

        const overridedCompositorRegistry = new Registry({ id: 'Compositor' })
        const OverridedElement: React.FC<ICommonProps> = () => <span>overrided</span>

        interface ICompositorRegistry {
          Element1: React.ComponentType<ICommonProps>
          Element2: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element1', Element1)
        compositorRegistry.set('Element2', Element2)
        overridedCompositorRegistry.set('Element1', OverridedElement)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element1, Element2 }: ICompositorRegistry) => (
              <>
                <Element1 />
                <Element2 />
              </>
            )}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(render(<OverridedCompositor />).text()).toEqual('overridedextra')
        expect(render(<Compositor />).text()).toEqual('contentextra')
      })

      test('should extend components in registry', () => {
        interface ICompositorRegistry {
          Element1: React.ComponentType<ICommonProps>
          Element2: React.ComponentType<ICommonProps>
        }

        const Element1: React.FC<ICommonProps> = () => <span>content</span>
        const Element2: React.FC<ICommonProps> = () => <span>extra</span>

        const compositorRegistry = new Registry({ id: 'Compositor' })
        compositorRegistry.set('Element1', Element1)
        compositorRegistry.set('Element2', Element2)

        const overridedCompositorRegistry = new Registry({ id: 'Compositor' })
        overridedCompositorRegistry.extends<React.FC<ICommonProps>>('Element1', (Base) => {
          return () => (
            <div>
              extended <Base />
            </div>
          )
        })

        const superOverridedCompositorRegistry = new Registry({ id: 'Compositor' })
        superOverridedCompositorRegistry.extends<React.FC<ICommonProps>>('Element1', (Base) => {
          return () => (
            <div>
              super <Base />
            </div>
          )
        })

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element1, Element2 }: ICompositorRegistry) => (
              <>
                <Element1 />
                <Element2 />
              </>
            )}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)
        const SuperOverridedCompositor = withRegistry(superOverridedCompositorRegistry)(
          OverridedCompositor,
        )

        expect(render(<SuperOverridedCompositor />).text()).toEqual('super extended contentextra')
        expect(render(<OverridedCompositor />).text()).toEqual('extended contentextra')
        expect(render(<Compositor />).text()).toEqual('contentextra')
      })

      test('should extend other values in registry', () => {
        interface ICompositorRegistry {
          prop: String
          functionProp: () => String
        }

        const compositorRegistry = new Registry({ id: 'Compositor' }).fill({
          prop: 'foo',
          functionProp: () => 'bar',
        })

        const overridedCompositorRegistry = new Registry({ id: 'Compositor' })
        overridedCompositorRegistry.extends<String>('prop', (Base) => `extended ${Base}`)
        overridedCompositorRegistry.extends<() => String>('functionProp', (Base) => () =>
          `extended ${Base()}`,
        )

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ prop, functionProp }: ICompositorRegistry) => (
              <div>
                {prop} / {functionProp()}
              </div>
            )}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(render(<Compositor />).text()).toEqual('foo / bar')
        expect(render(<OverridedCompositor />).text()).toEqual('extended foo / extended bar')
      })

      test('should throw error when try render hoc without base implementation', () => {
        const Element2: React.FC<ICommonProps> = () => <span>extra</span>

        const compositorRegistry = new Registry({ id: 'Compositor' })
        // There is no Element1 here
        compositorRegistry.set('Element2', Element2)

        const overridedCompositorRegistry = new Registry({ id: 'Compositor' })
        overridedCompositorRegistry.extends<React.FC<ICommonProps>>('Element1', (Base) => {
          return () => (
            <div>
              extended <Base />
            </div>
          )
        })

        interface ICompositorRegistry {
          Element1: React.ComponentType<ICommonProps>
          Element2: React.ComponentType<ICommonProps>
        }

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element1, Element2 }: ICompositorRegistry) => (
              <>
                <Element1 />
                <Element2 />
              </>
            )}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridenCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(() => render(<OverridenCompositor />)).toThrow(
          "Overload has no base in Registry 'Compositor'",
        )
      })

      test('should allow to use any registry in context', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const element2Registry = new Registry({ id: 'Element2' })
        const Element1: React.FC<ICommonProps> = () => <span>content</span>
        const Element2Presenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => (
              <>
                <Element />
                extra
              </>
            )}
          </RegistryConsumer>
        )
        const Element2 = withRegistry(element2Registry)(Element2Presenter)

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
          Element2: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element1)
        compositorRegistry.set('Element2', Element2)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="Compositor">
            {({ Element2 }: ICompositorRegistry) => <Element2 />}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).toEqual('contentextra')
      })

      test('should not influence adjacent context', () => {
        const registry = new Registry({ id: 'RegistryParent' })
        const registryA = new Registry({ id: 'TestRegistry' })
        const registryB = new Registry({ id: 'TestRegistry' })
        const elementA: React.FC<ICommonProps> = () => <span>a</span>
        const elementB: React.FC<ICommonProps> = () => <span>b</span>

        registryA.set('Element', elementA)
        registryB.set('Element', elementB)

        const ElementPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer id="TestRegistry">{({ Element }) => <Element />}</RegistryConsumer>
        )

        const BranchA = withRegistry(registryA)(ElementPresenter)
        const BranchB = withRegistry(registryB)(ElementPresenter)

        const AppPresenter: React.FC<ICommonProps> = () => (
          <>
            <BranchA />
            <BranchB />
            <BranchA />
          </>
        )

        const App = withRegistry(registry)(AppPresenter)

        expect(render(<App />).text()).toEqual('aba')
      })
    })

    test('should merge all provided registries', () => {
      const registryA = new Registry({ id: 'TestRegistry' })
      const ElementA = (_props: ICommonProps) => <span>content</span>

      registryA.set('ElementA', ElementA)

      const ElementAPresenter: React.FC<ICommonProps> = () => (
        <RegistryConsumer id="TestRegistry">{({ ElementA }) => <ElementA />}</RegistryConsumer>
      )

      const ElementB = (_props: ICommonProps) => <span>content of elementB</span>
      const registryB = new Registry({ id: 'TestRegistry' })

      registryB.set('ElementB', ElementB)

      const ElementBPresenter: React.FC<ICommonProps> = () => (
        <RegistryConsumer id="TestRegistry">{({ ElementB }) => <ElementB />}</RegistryConsumer>
      )

      const AppA = withRegistry(registryA, registryB)(ElementAPresenter)
      const AppB = withRegistry(registryA, registryB)(ElementBPresenter)

      expect(render(<AppA />).text()).toEqual('content')
      expect(render(<AppB />).text()).toEqual('content of elementB')
    })

    describe('hooks', () => {
      test('should provide registry with useRegistries', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element = (_props: ICommonProps) => <span>content</span>

        interface ICompositorRegistry {
          Element: typeof Element
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter = (_props: ICommonProps) => {
          const registries = useRegistries()
          const registry = registries.Compositor
          const { Element } = registry.snapshot<ICompositorRegistry>()

          return <Element />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).toEqual('content')
      })

      test('should provide assign registry with useRegistry', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element = (_props: ICommonProps) => <span>content</span>

        interface ICompositorRegistry {
          Element: typeof Element
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter = (_props: ICommonProps) => {
          const { Element } = useRegistry<ICompositorRegistry>('Compositor')

          return <Element />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).toEqual('content')
      })
    })

    describe('compose', () => {
      test('should return correct type after composition', () => {
        const componentRegistry = new Registry({ id: 'Component' })
        const Component = (_props: ICommonProps) => null
        const EnhancedComponent = compose(withRegistry(componentRegistry))(Component)
        // eslint-disable-next-line semi
        ;<EnhancedComponent className="hello" />
      })
    })
  })
})
