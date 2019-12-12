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

export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>

interface IRegistryHOC<T> {
  $symbol: Symbol
  hoc: HOC<T>
}

type IRegistryEntity<T = any> = ComponentType<T> | IRegistryHOC<T>
type IRegistryComponents = Record<string, IRegistryEntity>

const registryHocSymbol = Symbol('RegistryHOC')

export function withBase<T>(hoc: HOC<T>): IRegistryHOC<T> {
  return {
    $symbol: registryHocSymbol,
    hoc
  }
}

function isHoc<T>(component: IRegistryEntity<T>): component is IRegistryHOC<T> {
  return (component as IRegistryHOC<T>).$symbol === registryHocSymbol
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
  set<T>(id: string, component: IRegistryEntity<T>) {
    this.components[id] = component

    return this
  }

  /**
   * Set react components in registry via object literal.
   *
   * @param componentsSet set of valid react components
   */
  fill(componentsSet: IRegistryComponents) {
    this.components = {
      ...this.components,
      ...componentsSet,
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
   *
   * @param otherRegistry external registry
   */
  merge(otherRegistry?: Registry) {
    const clone = new Registry({ id: this.id, overridable: this.overridable })
    clone.components = { ...this.components }

    if (!otherRegistry) return clone

    const otherRegistryComponents = otherRegistry.snapshot<IRegistryComponents>()

    for (let componentName in otherRegistryComponents) {
      if (!Object.prototype.hasOwnProperty.call(otherRegistryComponents, componentName)) continue
    
      clone.components[componentName] = this.mergeComponents(
        clone.components[componentName],
        otherRegistryComponents[componentName]
      )
    }

    return clone
  }

  private mergeComponents(base: IRegistryEntity, overrides: IRegistryEntity): IRegistryEntity {
    if (isHoc(overrides)) {
      if (isHoc(base)) {
        // If both components are hocs, then create compose-hoc
        return withBase(Base => overrides.hoc(base.hoc(Base)))
      }

      return overrides.hoc(base)
    }

    return overrides
  }
}
