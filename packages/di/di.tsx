import React, {
    ReactNode,
    FunctionComponent,
    StatelessComponent,
    ComponentType,
    createContext,
    useContext,
} from 'react';

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
                        const providedRegistries = { ...contextRegistries };

                        registries.forEach(registry => {
                            const overrides = contextRegistries[registry.id];

                            providedRegistries[registry.id] = registry.overridable
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

export interface IComponentRegistryConsumerProps {
    id: string;
    children: (registry: any) => ReactNode;
}

export const ComponentRegistryConsumer: FunctionComponent<IComponentRegistryConsumerProps> = props => (
    <RegistryConsumer>
        {registries => {
            if (__DEV__) {
                if (!registries[props.id]) {
                    throw new Error(`Registry with id '${props.id}' not found.`);
                }
            }

            return props.children(registries[props.id].snapshot());
        }}
    </RegistryConsumer>
);

export const useRegistries = () => {
    return useContext(registryContext);
};

export const useComponentRegistry = <T extends {}>(id: string) => {
    const registries = useRegistries();

    return registries[id].snapshot<T>();
};

export interface IRegistryOptions {
    id: string;
    overridable?: boolean;
}

interface IRegistryComponents {
    [key: string]: any;
}

export class Registry {
    id: string;
    overridable: boolean;
    private components: IRegistryComponents = {};

    constructor({ id, overridable = true }: IRegistryOptions) {
        this.id = id;
        this.overridable = overridable;
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
        const clone = new Registry({ id: this.id, overridable: this.overridable });

        clone.components = {
            ...this.components,
            ...(registry ? registry.snapshot() : {}),
        };

        return clone;
    }
}
