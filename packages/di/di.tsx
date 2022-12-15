import React, {
  ReactNode,
  FC,
  ComponentType,
  createContext,
  useContext,
  useRef,
  createElement,
} from 'react'

export type RegistryContext = Record<string, Registry>

export const registryContext = createContext<RegistryContext>({})
const RegistriesConsumer = registryContext.Consumer
const RegistryProvider = registryContext.Provider

export function withRegistry(
  ...registries: Registry[]
): <P extends {}>(Component: ComponentType<P>) => FC<P>
export function withRegistry() {
  // Use arguments instead of rest-arguments to get faster and more compact code.
  const registries: Registry[] = [].slice.call(arguments)

  return function WithRegistry<P extends {}>(Component: ComponentType<P>) {
    const RegistryResolver: FC<P> = (props) => {
      const providedRegistriesRef = useRef<RegistryContext | null>(null)

      return (
        <RegistriesConsumer>
          {(contextRegistries) => {
            if (providedRegistriesRef.current === null) {
              const providedRegistries = { ...contextRegistries }

              for (let i = 0; i < registries.length; i++) {
                const registry = registries[i]
                const overrides = providedRegistries[registry.id]
                // eslint-disable-next-line no-nested-ternary
                providedRegistries[registry.id] = registry.overridable
                  ? overrides
                    ? registry.merge(overrides)
                    : registry
                  : registry && overrides
                    ? overrides.merge(registry)
                    : registry
              }

              providedRegistriesRef.current = providedRegistries
            }

            return (
              <RegistryProvider value={providedRegistriesRef.current}>
                {/* Use createElement instead of jsx to avoid __assign from tslib. */}
                {createElement(Component, props)}
              </RegistryProvider>
            )
          }}
        </RegistriesConsumer>
      )
    }

    if (__DEV__) {
      const resolverValue = registries.map((registry) => registry.id).join(', ')
      // TODO: Use setDisplayName util.
      RegistryResolver.displayName = `RegistryResolver(${resolverValue})`
    }

    return RegistryResolver
  }
}

export interface IRegistryConsumerProps {
  id: string
  children: (registry: any) => ReactNode
}

export const RegistryConsumer: FC<IRegistryConsumerProps> = (props) => (
  <RegistriesConsumer>
    {(registries) => {
      if (__DEV__) {
        if (!registries[props.id]) {
          throw new Error(`Registry with id '${props.id}' not found.`)
        }
      }

      return props.children(registries[props.id].snapshot())
    }}
  </RegistriesConsumer>
)

/**
 * @deprecated consider using 'RegistryConsumer' instead
 */
export const ComponentRegistryConsumer = RegistryConsumer

export const useRegistries = () => {
  return useContext(registryContext)
}

export function useRegistry(id: string) {
  const registries = useRegistries()

  return registries[id].snapshot()
}

/**
 * @deprecated consider using 'useRegistry' instead
 */
export const useComponentRegistry = useRegistry

export interface IRegistryOptions {
  id: string
  overridable?: boolean
}

const registryOverloadMark = 'RegistryOverloadMark'

type SimpleOverload<T> = (Base: T) => T

interface IRegistryEntityOverload<T> {
  $symbol: typeof registryOverloadMark
  overload: SimpleOverload<T>
}

type IRegistryEntity<T = any> = T | IRegistryEntityOverload<T>
export type IRegistryEntities = Record<string, IRegistryEntity>

function withOverload<T>(overload: SimpleOverload<T>): IRegistryEntityOverload<T> {
  return {
    $symbol: registryOverloadMark,
    overload,
  }
}

function isOverload<T>(entity: IRegistryEntity<T>): entity is IRegistryEntityOverload<T> {
  return (entity as IRegistryEntityOverload<T>).$symbol === registryOverloadMark
}

export class Registry {
  id: string
  overridable: boolean
  private entities: IRegistryEntities = {}

  constructor({ id, overridable = true }: IRegistryOptions) {
    this.id = id
    this.overridable = overridable
  }

  /**
   * Set registry entry by id.
   *
   * @param id entry id
   * @param entity valid registry entity
   */
  set<T>(id: string, entity: T) {
    this.entities[id] = entity

    return this
  }

  /**
   * Set extender for registry entry by id.
   *
   * @param id entry id
   * @param overload valid registry entity extender
   */
  extends<T>(id: string, overload: SimpleOverload<T>) {
    this.entities[id] = withOverload(overload)

    return this
  }

  /**
   * Set react entities in registry via object literal.
   *
   * @param entitiesSet set of valid registry entities
   */
  fill(entitiesSet: IRegistryEntities) {
    for (const key in entitiesSet) {
      this.entities[key] = entitiesSet[key]
    }

    return this
  }

  /**
   * Get entry from registry by id.
   *
   * @param id entry id
   */
  get<T>(id: string): IRegistryEntity<T> {
    if (__DEV__) {
      if (!this.entities[id]) {
        throw new Error(`Entry with id '${id}' not found.`)
      }
    }

    return this.entities[id]
  }

  /**
   * Returns raw entities from registry.
   */
  snapshot(): IRegistryEntities {
    return this.entities
  }

  /**
   * Override entities by external registry.
   * @internal
   *
   * @param otherRegistry external registry
   */
  merge(otherRegistry?: Registry) {
    const clone = new Registry({ id: this.id, overridable: this.overridable })
    clone.fill(this.entities)

    if (!otherRegistry) return clone

    const otherRegistryEntities = otherRegistry.snapshot()

    for (const entityName in otherRegistryEntities) {
      if (!otherRegistryEntities.hasOwnProperty(entityName)) continue

      clone.entities[entityName] = this.mergeEntities(
        clone.entities[entityName],
        otherRegistryEntities[entityName],
      )
    }

    return clone
  }

  /**
   * Returns extended or replaced entity
   *
   * @param base base implementation
   * @param overrides overridden implementation
   */
  private mergeEntities(base: IRegistryEntity, overrides: IRegistryEntity): IRegistryEntity {
    if (isOverload(overrides)) {
      if (!base) return overrides

      if (isOverload(base)) {
        // If both entities are hocs, then create compose-hoc
        return withOverload((Base) => overrides.overload(base.overload(Base)))
      }

      return overrides.overload(base)
    }

    return overrides
  }
}
