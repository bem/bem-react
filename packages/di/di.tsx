import * as React from 'react';
import { createContext } from 'react';

type RegistryContext = Record<string, Registry>;
const registryContext = createContext<RegistryContext>({});
const RegistryProvider = registryContext.Provider;
export const RegistryConsumer = registryContext.Consumer;

export function withRegistry<P>(...registries: Registry[]) {
    return function(Component: React.ComponentType<P>) {
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

export interface IRegistry {
    id: string;
    inverted?: true;
}

export class Registry {
    id: string;
    inverted: boolean = false;

    private components = new Map();

    constructor(options: IRegistry) {
        this.id = options.id;
        this.inverted = Boolean(options.inverted);
    }

    set(id: string, component: React.ComponentType) {
        this.components.set(id, component);
    }

    get<P>(id?: string): React.ComponentType<P> {
        const component = this.components.get(id);
        if (__DEV__) {
            if (!component) {
                throw new Error(`Component with id '${id}' not found.`);
            }
        }

        return component;
    }
}
