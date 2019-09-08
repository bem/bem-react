// tslint:disable no-shadowed-variable
import React from 'react'
import { describe, it } from 'mocha'
import { expect, assert } from 'chai'
import { render } from 'enzyme'

import {
  Registry,
  withRegistry,
  RegistryConsumer,
  ComponentRegistryConsumer,
  useRegistries,
  useComponentRegistry,
} from '../di'
import { compose } from '../../core/core'

interface ICommonProps {
  className?: string
}

describe('@bem-react/di', () => {
  describe('Registry', () => {
    it('should set and components by id', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      expect(registry.get('id-1')).to.eq(Component1)
      expect(registry.get('id-2')).to.eq(Component2)
    })

    it('should return list of components', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      const snapshot = {
        'id-1': Component1,
        'id-2': Component2,
      }

      expect(registry.snapshot()).to.eql(snapshot)
    })

    it('should merge registries', () => {
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

      expect(registry.merge(overrides).snapshot()).to.eql(snapshot)
    })

    it('should not affect registry in merge with undefined', () => {
      const registry = new Registry({ id: 'registry' })
      const Component1 = () => null
      const Component2 = () => <span />

      registry.set('id-1', Component1).set('id-2', Component2)

      const snapshot = {
        'id-1': Component1,
        'id-2': Component2,
      }

      // @ts-ignore to check inside logic
      expect(registry.merge().snapshot()).to.eql(snapshot)
    })

    it("should throw error when component doesn't exist", () => {
      const registry = new Registry({ id: 'registry' })

      expect(() => registry.get('id')).to.throw("Component with id 'id' not found.")
    })
  })

  describe('withRegistry', () => {
    describe('consumer', () => {
      it('should provide registry to context', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element: React.FC<ICommonProps> = () => <span>content</span>

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <RegistryConsumer>
            {(registries) => {
              const registry = registries['Compositor']
              const { Element } = registry.snapshot<ICompositorRegistry>()

              return <Element />
            }}
          </RegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('content')
      })

      it('should provide assign registry with component', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element: React.FC<ICommonProps> = () => <span>content</span>

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <ComponentRegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => <Element />}
          </ComponentRegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('content')
      })

      it('should override components in registry by context', () => {
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
            <ComponentRegistryConsumer id="Compositor">
              {({ Element }: ICompositorRegistry) => <Element />}
            </ComponentRegistryConsumer>
          ))

          return <Content />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('overrided')
      })

      it('should override components in registry from top node', () => {
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
          <ComponentRegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => <Element />}
          </ComponentRegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(render(<Compositor />).text()).eq('content')
        expect(render(<OverridedCompositor />).text()).eq('overrided')
      })

      it('should partially override components in registry', () => {
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
          <ComponentRegistryConsumer id="Compositor">
            {({ Element1, Element2 }: ICompositorRegistry) => (
              <>
                <Element1 />
                <Element2 />
              </>
            )}
          </ComponentRegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)
        const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor)

        expect(render(<OverridedCompositor />).text()).eq('overridedextra')
        expect(render(<Compositor />).text()).eq('contentextra')
      })

      it('should allow to use any registry in context', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const element2Registry = new Registry({ id: 'Element2' })
        const Element1: React.FC<ICommonProps> = () => <span>content</span>
        const Element2Presenter: React.FC<ICommonProps> = () => (
          <ComponentRegistryConsumer id="Compositor">
            {({ Element }: ICompositorRegistry) => (
              <>
                <Element />
                extra
              </>
            )}
          </ComponentRegistryConsumer>
        )
        const Element2 = withRegistry(element2Registry)(Element2Presenter)

        interface ICompositorRegistry {
          Element: React.ComponentType<ICommonProps>
          Element2: React.ComponentType<ICommonProps>
        }

        compositorRegistry.set('Element', Element1)
        compositorRegistry.set('Element2', Element2)

        const CompositorPresenter: React.FC<ICommonProps> = () => (
          <ComponentRegistryConsumer id="Compositor">
            {({ Element2 }: ICompositorRegistry) => <Element2 />}
          </ComponentRegistryConsumer>
        )

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('contentextra')
      })

      it('should not influence adjacent context', () => {
        const registry = new Registry({ id: 'RegistryParent' })
        const registryA = new Registry({ id: 'TestRegistry' })
        const registryB = new Registry({ id: 'TestRegistry' })
        const elementA: React.FC<ICommonProps> = () => <span>a</span>
        const elementB: React.FC<ICommonProps> = () => <span>b</span>

        registryA.set('Element', elementA)
        registryB.set('Element', elementB)

        const ElementPresenter: React.FC<ICommonProps> = () => (
          <ComponentRegistryConsumer id="TestRegistry">
            {({ Element }) => <Element />}
          </ComponentRegistryConsumer>
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

        expect(render(<App />).text()).eq('aba')
      })
    })

    describe('hooks', () => {
      it('should provide registry with useRegistries', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element = (props: ICommonProps) => <span>content</span>

        interface ICompositorRegistry {
          Element: typeof Element
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter = (props: ICommonProps) => {
          const registries = useRegistries()
          const registry = registries['Compositor']
          const { Element } = registry.snapshot<ICompositorRegistry>()

          return <Element />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('content')
      })

      it('should provide assign registry with useComponentRegistry', () => {
        const compositorRegistry = new Registry({ id: 'Compositor' })
        const Element = (props: ICommonProps) => <span>content</span>

        interface ICompositorRegistry {
          Element: typeof Element
        }

        compositorRegistry.set('Element', Element)

        const CompositorPresenter = (props: ICommonProps) => {
          const { Element } = useComponentRegistry<ICompositorRegistry>('Compositor')

          return <Element />
        }

        const Compositor = withRegistry(compositorRegistry)(CompositorPresenter)

        expect(render(<Compositor />).text()).eq('content')
      })
    })

    describe('compose', () => {
      it('should return correct type after composition', () => {
        const componentRegistry = new Registry({ id: 'Component' })
        const Component = (props: ICommonProps) => null
        const EnhancedComponent = compose(withRegistry(componentRegistry))(Component)
        ;<EnhancedComponent className="hello" />
        assert(true)
      })
    })
  })
})
