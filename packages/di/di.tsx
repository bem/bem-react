import * as React from 'react';
import { createContext } from 'react';

type RegistryContext = Record<string, Registry>;
const registryContext = createContext<RegistryContext>({});
const RegistryProvider = registryContext.Provider;
export const RegistryConsumer = registryContext.Consumer;

export function withRegistry<P>(...registries: Registry[]) {
    return function WithRegistry(Component: React.ComponentType<P>) {
        const RegistryResolver: React.SFC<P> = (props: P) => {
            return (
                <RegistryConsumer>
                    {contextRegistries => {
                        const providedRegistries: RegistryContext = {};

                        registries.forEach(registry => {
                            const overrides = contextRegistries[registry.id];

                            providedRegistries[registry.id] = registry.inverted
                                ? (overrides || registry)
                                : (registry || overrides);
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

export interface IRegistryOptions {
    id: string;
    inverted?: boolean;
}

export class Registry {
    id: string;
    inverted: boolean;

    private components = new Map<string, any>();

    constructor({ id, inverted = false }: IRegistryOptions) {
        this.id = id;
        this.inverted = inverted;
    }

    set<T>(id: string, component: React.ComponentType<T>) {
        this.components.set(id, component);
    }

    /**
     * Get react component from registry by id.
     *
     * @param id component id
     */
    get<T>(id: string): React.ComponentType<T> {
        if (__DEV__) {
            if (!this.components.has(id)) {
                throw new Error(`Component with id '${id}' not found.`);
            }
        }

        return this.components.get(id);
    }
}
