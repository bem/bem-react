import * as React from 'react';
export declare const RegistryConsumer: React.ComponentType<React.ConsumerProps<Record<string, Registry>>>;
export declare function withRegistry<P>(...registries: Registry[]): (Component: React.ComponentType<P>) => React.StatelessComponent<P>;
export interface IRegistryOptions {
    id: string;
    inverted?: boolean;
}
export declare class Registry {
    id: string;
    inverted: boolean;
    private components;
    constructor({ id, inverted }: IRegistryOptions);
    set<T>(id: string, component: React.ComponentType<T>): this;
    get<T>(id: string): React.ComponentType<T>;
}
