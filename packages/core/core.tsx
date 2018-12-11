import React, { ComponentType, StatelessComponent } from 'react';
import { cn, NoStrictEntityMods } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

export interface IClassNameProps {
    className?: string;
}

export type ModBody<P extends IClassNameProps> = (WrappedComponent: ComponentType<P>) => ComponentType<P>;

interface IDisplayNameData {
    wrapper: any;
    wrapped: any;
    value: any;
    isApplied?: boolean;
}

type Dictionary<T = any> = { [key: string]: T };
export type Nullable<T> = T | null;

export function withBemMod<P extends IClassNameProps>(blockName: string, mod: NoStrictEntityMods, enhance?: ModBody<P>) {
    // Use cache to prevent create new component when props are changed.
    let ModifiedComponent: Nullable<ComponentType<P>> = null;

    return function WithBemMod(WrappedComponent: ComponentType<P>) {
        function BemMod(props: P) {
            const entity = cn(blockName);

            if (Object.keys(mod).every(key => (props as Dictionary)[key] === mod[key])) {
                const modifierClassName = entity(mod);
                const nextClassName = classnames(modifierClassName, props.className)
                    // we add modifiers as mix, we need to remove base entity selector
                    // if we don't:  cnBlock(null, [className]) => Block Block Block_modName
                    // if we do:  cnBlock(null, [className]) => Block Block_modName
                    .replace(`${entity()} `, '');
                const nextProps = Object.assign({}, props, { className: nextClassName });

                if (__DEV__) {
                    setDisplayName(BemMod, {
                        wrapper: WithBemMod,
                        wrapped: entity(),
                        value: mod,
                        isApplied: true,
                    });
                }

                if (enhance !== undefined) {
                    if (ModifiedComponent === null) {
                        ModifiedComponent = enhance(WrappedComponent);
                    }
                } else {
                    ModifiedComponent = WrappedComponent;
                }

                return <ModifiedComponent {...nextProps} />;
            }

            if (__DEV__) {
                setDisplayName(BemMod, {
                    wrapper: WithBemMod,
                    wrapped: entity(),
                    value: mod,
                });
            }

            return <WrappedComponent {...props} />;
        }

        return BemMod;
    };
}

function getDisplayName<T>(Component: ComponentType<T> | string) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Component';
}

function setDisplayName(Component: ComponentType<any>, displayNameData: IDisplayNameData) {
    const value = JSON.stringify(displayNameData.value)
        .replace(/\{|\}|\"|\[|\]/g, '')
        .replace(/,/g, ' | ');
    const wrapperName = getDisplayName(displayNameData.wrapper);
    const wrappedName = typeof displayNameData.wrapped === 'string'
        ? displayNameData.wrapped
        : getDisplayName(displayNameData.wrapped);

    // Wrapper(WrappedComponent)[applied values][is applied]
    Component.displayName = `${wrapperName}(${wrappedName})`;

    if (value) {
        Component.displayName += `[${value}]`;
    }

    Component.displayName += displayNameData.isApplied ? '[enabled]' : '[disabled]';
}

export type ExtractProps<T> = T extends ComponentType<infer K> ? K : never;
export type Wrapper<T> = (WrappedComponent: ComponentType) => ComponentType<T>;
export type Composition<T> = <U extends ComponentType>(fn: U) =>
    StatelessComponent<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>;

/* tslint:disable:max-line-length */
export function compose<T1>(fn1: Wrapper<T1>): Composition<T1>;

export function compose<T1, T2>(fn1: Wrapper<T1>, fn2: Wrapper<T2>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2> : Composition<T1 & T2>;

export function compose<T1, T2, T3>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3> : Composition<T1 & T2 & T3>;

export function compose<T1, T2, T3, T4>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>, fn4: Wrapper<T4>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3 | T4> : Composition<T1 & T2 & T3 & T4>;

export function compose<T1, T2, T3, T4, T5>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>, fn4: Wrapper<T4>, fn5: Wrapper<T5>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3 | T4 | T5> : Composition<T1 & T2 & T3 & T4 & T5>;

export function compose<T1, T2, T3, T4, T5, T6>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>, fn4: Wrapper<T4>, fn5: Wrapper<T5>, fn6: Wrapper<T6>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3 | T4 | T5 | T6> : Composition<T1 & T2 & T3 & T4 & T5 & T6>;

export function compose<T1, T2, T3, T4, T5, T6, T7>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>, fn4: Wrapper<T4>, fn5: Wrapper<T5>, fn6: Wrapper<T6>, fn7: Wrapper<T7>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7> : Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7>;

export function compose<T1, T2, T3, T4, T5, T6, T7, T8>(fn1: Wrapper<T1>, fn2: Wrapper<T2>, fn3: Wrapper<T3>, fn4: Wrapper<T4>, fn5: Wrapper<T5>, fn6: Wrapper<T6>, fn7: Wrapper<T7>, fn8: Wrapper<T8>):
    keyof T1 extends keyof T2 ? Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8> : Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>;

export function compose(...fns: Array<Wrapper<any>>): Composition<any>;
/* tslint:enable:max-line-length */

/**
 * @param funcs higher order components
 *
 * @example
 * ```ts
 * import { compose } from '@bem-react/core';
 *
 * const Enhanced = compose(
 *     withBemMod('Component', { size: 's' }),
 *     withBemMod('Component', { theme: 'normal' }),
 * )(Component);
 * ```
 */
export function compose(...funcs: any[]) {
    return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg);
}
