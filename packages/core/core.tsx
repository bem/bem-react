import * as React from 'react';
import { cn, classnames, NoStrictEntityMods } from '@bem-react/classname';

export interface IClassNameProps {
    className?: string;
}

export type ModBody<P extends IClassNameProps> = (Block: React.ComponentType<P>, props: P) => JSX.Element;

interface IDisplayNameData {
    wrapper: any;
    wrapped: any;
    value: any;
    isApplied?: boolean;
}

export function withBemMod<P extends IClassNameProps>(blockName: string, mod: NoStrictEntityMods, cb?: ModBody<P>) {
    return function WithBemMod(WrappedComponent: React.ComponentType<P>) {
        function BemMod(props: Dictionary<P>) {
            const entity = cn(blockName);

            if (Object.keys(mod).every(key => props[key] === mod[key])) {
                const nextClassName = classnames(entity(mod), props.className);
                const nextProps = Object.assign({}, props, { className: nextClassName });

                if (__DEV__) {
                    setDisplayName(BemMod, {
                        wrapper: WithBemMod,
                        wrapped: entity(),
                        value: mod,
                        isApplied: true,
                    });
                }

                return cb
                    ? cb(WrappedComponent, nextProps)
                    : <WrappedComponent {...nextProps} />;
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

function getDisplayName<T>(Component: React.ComponentType<T> | string) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Component';
}

function setDisplayName(Component: React.ComponentType<any>, displayNameData: IDisplayNameData) {
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

/**
 * React component.
 */
export type C<T> = React.ComponentType<T>;

/**
 * Higher order component.
 */
export type H<T> = (Component: C<T>) => C<T>;

/* tslint:disable:max-line-length */
export function compose<T0>(h0: H<T0>): <T>(f: C<T>) => C<T & T0>;
export function compose<T0, T1>(h0: H<T0>, h1: H<T1>): <T>(f: C<T>) => C<T & (T0 | T1)>;
export function compose<T0, T1, T2>(h0: H<T0>, h1: H<T1>, h2: H<T2>): <T>(f: C<T>) => C<T & (T0 | T1 | T2)>;
export function compose<T0, T1, T2, T3>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3)>;
export function compose<T0, T1, T2, T3, T4>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4)>;
export function compose<T0, T1, T2, T3, T4, T5>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5)>;
export function compose<T0, T1, T2, T3, T4, T5, T6>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>, h14: H<T14>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14)>;
export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>, h14: H<T14>, h15: H<T15>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14 | T15)>;
/* tslint:enable:max-line-length */

/**
 * @param funcs higher order components
 *
 * @example
 * ```ts
 * const Enhcanced = (
 *     withBemMod('Component', { size: 's' }),
 *     withBemMod('Component', { theme: 'normal' }),
 * )(Component);
 * ```
 */
export function compose(...funcs: any[]) {
    return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg);
}
