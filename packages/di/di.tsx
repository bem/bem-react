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

export interface IRegistry {
    id: string;
    inverted?: true;
}

export class Registry extends Map<string, any> {
    id: string;
    inverted?: boolean = false;

    constructor(options: IRegistry) {
        super();
        this.id = options.id;
        this.inverted = options.inverted;
    }

    get<P>(id: string): React.ComponentType<P> {
        if (__DEV__) {
            if (!this.has(id)) {
                throw new Error(`Component with id '${id}' not found.`);
            }
        }

        return this.get(id);
    }
}
