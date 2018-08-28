import * as React from 'react';
import { createContext } from 'react';

type RegistryContext = Record<string, Registry>;
const registryContext = createContext<RegistryContext>({});
const RegistryProvider = registryContext.Provider;
export const RegistryConsumer = registryContext.Consumer;

export function withRegistry<P>(...registries: Registry[]) {
    return function(Component: ValidComponent<P>) {
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

type ValidComponent<P = {}> = React.ComponentClass<P> | React.SFC<P>;

export interface IRegistry {
    id: string;
    inverted?: true;
}

export class Registry {
    private id_: string;
    private inverted_: boolean = false;
    private components = new Map();

    constructor(options: IRegistry) {
        this.id_ = options.id;
        this.inverted_ = Boolean(options.inverted);
    }

    get id() { return this.id_; }
    get inverted() { return this.inverted_; }

    add(id: string, component: ValidComponent) {
        this.components.set(id, component);
    }

    get<P>(id?: string): ValidComponent<P> {
        const component = this.components.get(id);
        if (!component) {
            throw new Error(`Component with id '${id}' not found.`);
        }

        return component;
    }
}
