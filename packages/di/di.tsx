import React, { ReactNode, FC, ComponentType, createContext, useContext } from 'react'

export type RegistryContext = Record<string, Registry>

export const registryContext = createContext<RegistryContext>({})
const RegistryProvider = registryContext.Provider

export const RegistryConsumer = registryContext.Consumer

export function withRegistry(...registries: Registry[]) {
  return function WithRegistry<P>(Component: ComponentType<P>) {
    const RegistryResolver: FC<P> = (props) => {
      return (
        <RegistryConsumer>
          {(contextRegistries) => {
            const providedRegistries = { ...contextRegistries }

            registries.forEach((registry) => {
              const overrides = contextRegistries[registry.id]

              providedRegistries[registry.id] = registry.overridable
                ? overrides
                  ? registry.merge(overrides)
                  : registry
                : registry && overrides
                ? overrides.merge(registry)
                : registry
            })

            return (
              <RegistryProvider value={providedRegistries}>
                <Component {...props} />
              </RegistryProvider>
            )
          }}
        </RegistryConsumer>
      )
    }

    RegistryResolver.displayName = `RegistryResolver(${registries.map((r) => r.id).join(', ')})`

    return RegistryResolver
  }
}

export interface IComponentRegistryConsumerProps {
  id: string
  children: (registry: any) => ReactNode
}

export const ComponentRegistryConsumer: FC<IComponentRegistryConsumerProps> = (props) => (
  <RegistryConsumer>
    {(registries) => {
      if (__DEV__) {
        if (!registries[props.id]) {
          throw new Error(`Registry with id '${props.id}' not found.`)
        }
      }

      return props.children(registries[props.id].snapshot())
    }}
  </RegistryConsumer>
)

export const useRegistries = () => {
  return useContext(registryContext)
}

export const useComponentRegistry = <T extends {}>(id: string) => {
  const registries = useRegistries()

  return registries[id].snapshot<T>()
}

export interface IRegistryOptions {
  id: string
  overridable?: boolean
}

const registryHocMark = 'RegistryHoc'
export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>

type IRegistryEntity<T = any> = ComponentType<T> | IRegistryHOC<T>
type IRegistryComponents = Record<string, IRegistryEntity>

interface IRegistryHOC<T> extends React.FC<T> {
  $symbol: typeof registryHocMark
  hoc: HOC<T>
}

function withBase<T>(hoc: HOC<T>): IRegistryHOC<T> {
  const fakeComponent: IRegistryHOC<T> = () => {
    throw new Error(`Not found base component for enhance HOC: ${hoc.toString()}`)
  }

  fakeComponent.$symbol = registryHocMark as typeof registryHocMark
  fakeComponent.hoc = hoc

  return fakeComponent
}

function isHoc<T>(component: IRegistryEntity<T>): component is IRegistryHOC<T> {
  return (component as IRegistryHOC<T>).$symbol === registryHocMark
}

export class Registry {
  id: string
  overridable: boolean
  private components: IRegistryComponents = {}

  constructor({ id, overridable = true }: IRegistryOptions) {
    this.id = id
    this.overridable = overridable
  }

  /**
   * Set react component in registry by id.
   *
   * @param id component id
   * @param component valid react component
   */
  set<T>(id: string, component: ComponentType<T>) {
    this.components[id] = component

    return this
  }

  /**
   * Set hoc for extends component in registry by id
   *
   * @param id component id
   * @param hoc hoc for extends component
   */
  extends<T>(id: string, hoc: HOC<T>) {
    this.components[id] = withBase(hoc)

    return this
  }

  /**
   * Set react components in registry via object literal.
   *
   * @param componentsSet set of valid react components
   */
  fill(componentsSet: IRegistryComponents) {
    // tslint:disable-next-line:forin
    for (const key in componentsSet) {
      this.components[key] = componentsSet[key]
    }

    return this
  }

  /**
   * Get react component from registry by id.
   *
   * @param id component id
   */
  get<T>(id: string): IRegistryEntity<T> {
    if (__DEV__) {
      if (!this.components[id]) {
        throw new Error(`Component with id '${id}' not found.`)
      }
    }

    return this.components[id]
  }

  /**
   * Returns list of components from registry.
   */
  snapshot<RT>(): RT {
    return this.components as any
  }

  /**
   * Override components by external registry.
   * @internal
   *
   * @param otherRegistry external registry
   */
  merge(otherRegistry?: Registry) {
    const clone = new Registry({ id: this.id, overridable: this.overridable })
    clone.fill(this.components)

    if (!otherRegistry) return clone

    const otherRegistryComponents = otherRegistry.snapshot<IRegistryComponents>()

    for (const componentName in otherRegistryComponents) {
      if (!otherRegistryComponents.hasOwnProperty(componentName)) continue

      clone.components[componentName] = this.mergeComponents(
        clone.components[componentName],
        otherRegistryComponents[componentName],
      )
    }

    return clone
  }

  /**
   * Returns extended or replacing for base impleme
   *
   * @param base base implementation
   * @param overrides overridden implementation
   */
  private mergeComponents(base: IRegistryEntity, overrides: IRegistryEntity): IRegistryEntity {
    if (isHoc(overrides)) {
      if (!base) return overrides

      if (isHoc(base)) {
        // If both components are hocs, then create compose-hoc
        return withBase((Base) => overrides.hoc(base.hoc(Base)))
      }

      return overrides.hoc(base)
    }

    return overrides
  }
}
