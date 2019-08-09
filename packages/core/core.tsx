import React, { ComponentType, StatelessComponent } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

export interface IClassNameProps {
    className?: string;
}

export type Enhance<T extends IClassNameProps> = (WrappedComponent: ComponentType<T>) => ComponentType<T>;

type Dictionary<T = any> = { [key: string]: T };

export function withBemMod<T, U extends IClassNameProps = IClassNameProps>(blockName: string, mod: T, enhance?: Enhance<T & U>) {
    return function WithBemMod<K extends IClassNameProps = {}>(WrappedComponent: ComponentType<T & K>) {
        // Use cache to prevent create new component when props are changed.
        let ModifiedComponent: ComponentType<any>;

        return function BemMod(props: T & K) {
            const entity = cn(blockName);
            const isMatched = (key: string) => (props as Dictionary)[key] === (mod as Dictionary)[key];
            const isStarMatched = (key: string) => (mod as Dictionary)[key] === '*' && Boolean((props as Dictionary)[key]);

            if (__DEV__) {
                setDisplayName(BemMod, {
                    wrapper: WithBemMod,
                    wrapped: entity(),
                    value: mod,
                });
            }

            if (Object.keys(mod).every(key => isMatched(key) || isStarMatched(key))) {
                const modifierClassName = entity(Object.keys(mod).reduce((acc: Dictionary, key) => {
                    if ((mod as Dictionary)[key] !== '*') acc[key] = (mod as Dictionary)[key];

                    return acc;
                }, {}));
                const nextClassName = classnames(modifierClassName, props.className)
                    // we add modifiers as mix, we need to remove base entity selector
                    // if we don't:  cnBlock(null, [className]) => Block Block Block_modName
                    // if we do:  cnBlock(null, [className]) => Block Block_modName
                    .replace(`${entity()} `, '');
                const nextProps = Object.assign({}, props, { className: nextClassName });

                if (enhance !== undefined) {
                    if (ModifiedComponent === undefined) {
                        ModifiedComponent = enhance(WrappedComponent as any);

                        if (__DEV__) {
                            setDisplayName(ModifiedComponent, {
                                wrapper: 'WithBemModEnhance',
                                wrapped: WrappedComponent,
                            });
                        }
                    }
                } else {
                    ModifiedComponent = WrappedComponent as any;
                }

                return <ModifiedComponent {...nextProps} />;
            }

            return <WrappedComponent {...props} />;
        };
    };
}

function getDisplayName<T>(Component: ComponentType<T> | string) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Component';
}

type DisplayNameMeta = {
    /**
     * Wrapper component.
     */
    wrapper: any;

    /**
     * Wrapped component.
     */
    wrapped: any;

    /**
     * Modifiers entity.
     */
    value?: any;
};

function setDisplayName(Component: ComponentType<any>, meta: DisplayNameMeta) {
    const wrapperName = getDisplayName(meta.wrapper);
    const wrappedName = getDisplayName(meta.wrapped);

    Component.displayName = `${wrapperName}(${wrappedName})`;

    if (meta.value !== undefined) {
        const value = JSON.stringify(meta.value)
            .replace(/\{|\}|\"|\[|\]/g, '')
            .replace(/,/g, ' | ');

        Component.displayName += `[${value}]`;
    }
}

export type ExtractProps<T> = T extends ComponentType<infer K> ? K : never;
export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>;
export type Wrapper<T> = HOC<T>;
export type Composition<T> = <U extends ComponentType<any>>(fn: U) =>
    StatelessComponent<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>;

/* tslint:disable:max-line-length */
export function compose<T1>(fn1: HOC<T1>): Composition<T1>;

export function compose<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>):
    Composition<T1 & T2>;

export function compose<T1, T2, T3>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>):
    Composition<T1 & T2 & T3>;

export function compose<T1, T2, T3, T4>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>):
    Composition<T1 & T2 & T3 & T4>;

export function compose<T1, T2, T3, T4, T5>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>):
    Composition<T1 & T2 & T3 & T4 & T5>;

export function compose<T1, T2, T3, T4, T5, T6>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>):
    Composition<T1 & T2 & T3 & T4 & T5 & T6>;

export function compose<T1, T2, T3, T4, T5, T6, T7>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>, fn7: HOC<T7>):
    Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7>;

export function compose<T1, T2, T3, T4, T5, T6, T7, T8>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>, fn7: HOC<T7>, fn8: HOC<T8>):
    Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>;

export function compose(...fns: Array<HOC<any>>): Composition<any>;
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

/* tslint:disable:max-line-length */
export function composeU<T1>(fn1: HOC<T1>):
    Composition<T1>;

export function composeU<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>):
    Composition<T1 | T2>;

export function composeU<T1, T2, T3>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>):
    Composition<T1 | T2 | T3>;

export function composeU<T1, T2, T3, T4>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>):
    Composition<T1 | T2 | T3 | T4>;

export function composeU<T1, T2, T3, T4, T5>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>):
    Composition<T1 | T2 | T3 | T4 | T5>;

export function composeU<T1, T2, T3, T4, T5, T6>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>):
    Composition<T1 | T2 | T3 | T4 | T5 | T6>;

export function composeU<T1, T2, T3, T4, T5, T6, T7>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>, fn7: HOC<T7>):
    Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7>;

export function composeU<T1, T2, T3, T4, T5, T6, T7, T8>(fn1: HOC<T1>, fn2: HOC<T2>, fn3: HOC<T3>, fn4: HOC<T4>, fn5: HOC<T5>, fn6: HOC<T6>, fn7: HOC<T7>, fn8: HOC<T8>):
    Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>;

export function composeU(...fns: Array<HOC<any>>): Composition<any>;
/* tslint:enable:max-line-length */

export function composeU(...args: any[]) {
    return compose(...args);
}
