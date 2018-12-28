import React, { StatelessComponent, ComponentType, createContext } from 'react';

export type GetNonDefaultProps<T> = keyof T extends never ? never : T;
export type RegistryContext = Record<string, Registry>;

const registryContext = createContext<RegistryContext>({});
const RegistryProvider = registryContext.Provider;

export const RegistryConsumer = registryContext.Consumer;

export function withRegistry(...registries: Registry[]) {
    return function WithRegistry<P>(Component: ComponentType<P>) {
        const RegistryResolver: StatelessComponent<GetNonDefaultProps<P>> = (props: P) => {
            return (
                <RegistryConsumer>
                    {contextRegistries => {
                        const providedRegistries: RegistryContext = {};

                        registries.forEach(registry => {
                            const overrides = contextRegistries[registry.id];

                            providedRegistries[registry.id] = registry.inverted
                                ? overrides ? registry.merge(overrides) : registry
                                : (registry && overrides) ? overrides.merge(registry) : registry;
                        });

                        return (
                            <RegistryProvider value={providedRegistries}>
                                <Component {...props} />
                            </RegistryProvider>
                        );
                    }}
                </RegistryConsumer>
            );
        };

        RegistryResolver.displayName = `RegistryResolver(${registries.map(r => r.id).join(', ')})`;

        return RegistryResolver;
    };
}

export interface IComponentRegistryConsumer {
    id: string;
    children: (registry: any) => React.ReactNode;
}

export const ComponentRegistryConsumer: React.SFC<IComponentRegistryConsumer> = props => (
    <RegistryConsumer>
        {registries => props.children(registries[props.id].snapshot())}
    </RegistryConsumer>
);

export interface IRegistryOptions {
    id: string;
    inverted?: boolean;
}

interface IRegistryComponents {
    [key: string]: any;
}

export class Registry {
    id: string;
    inverted: boolean;
    private components: IRegistryComponents = {};

    constructor({ id, inverted = false }: IRegistryOptions) {
        this.id = id;
        this.inverted = inverted;
    }

    /**
     * Set react component in registry by id.
     *
     * @param id component id
     * @param component valid react component
     */
    set<T>(id: string, component: ComponentType<T>) {
        this.components[id] = component;

        return this;
    }

    /**
     * Get react component from registry by id.
     *
     * @param id component id
     */
    get<T>(id: string): ComponentType<T> {
        if (__DEV__) {
            if (!this.components[id]) {
                throw new Error(`Component with id '${id}' not found.`);
            }
        }

        return this.components[id];
    }

    /**
     * Returns list of components from registry.
     */
    snapshot<RT>(): RT  {
        return this.components as any;
    }

    /**
     * Override components by external registry.
     *
     * @param registry external registry
     */
    merge(registry: Registry) {
        this.components = {
            ...this.components,
            ...(registry ? registry.snapshot() : {}),
        };

        return this;
    }
}
