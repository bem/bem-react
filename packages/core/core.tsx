import * as React from 'react';
import { ClassNameFormatter, cn, list } from '@bem-react/classname';

export interface IClassNameProps {
    className?: string;
}

export type NoStrictEntityMods = Record<string, string | boolean | number | undefined>;
export type ModBody<P> = (Block: React.SFC<P>, props: P) => JSX.Element;

interface IDisplayNameData {
    wrapper: any;
    wrapped: any;
    value: any;
    isApplied?: boolean;
}

export function withBemClassName<P extends IClassNameProps>(
    cnFormatter: ClassNameFormatter,
    mapPropsToBemMods: (props: P) => NoStrictEntityMods | undefined = () => undefined,
) {
    return function WithBemClassName(WrappedComponent: any): React.SFC<P> {
        return function BemClassName(props: P) {
            const newProps: P = cnProps(cnFormatter(), cnFormatter(mapPropsToBemMods(props)), props.className)(props);

            if (__DEV__) {
                setDisplayName(BemClassName, {
                    wrapper: WithBemClassName,
                    wrapped: WrappedComponent,
                    value: list(cnFormatter(), cnFormatter(mapPropsToBemMods(props))),
                });
            }

            return <WrappedComponent {...newProps} />;
        };
    };
}

export function withBemMod<P extends IClassNameProps>(mod: NoStrictEntityMods, cb?: ModBody<P>) {
    return function WithBemMod(WrappedComponent: React.SFC<P>) {
        return function BemMod(props: P) {
            if (!props.className) {
                return <WrappedComponent {...props}/>;
            }

            const entity = cn(props.className.split(' ')[0]);

            if (matchSubset(props, mod)) {
                const newProps: P = cnProps(props.className, entity(mod))(props);

                if (__DEV__) {
                    setDisplayName(BemMod, {
                        wrapper: WithBemMod,
                        wrapped: entity(),
                        value: mod,
                        isApplied: true,
                    });
                }

                return cb
                    ? cb(WrappedComponent, newProps)
                    : <WrappedComponent {...newProps} />;
            }

            if (__DEV__) {
                setDisplayName(BemMod, {
                    wrapper: WithBemMod,
                    wrapped: entity(),
                    value: mod,
                });
            }

            return <WrappedComponent {...props}/>;
        };
    };
}

export function withBemClassMix<P extends IClassNameProps>(...mix: Array<string | undefined>) {
    return function WithBemClassMix(WrappedComponent: React.ComponentType<P>) {
        return function BemClassMix(props: P) {
            const newProps: P = cnProps(props.className, ...mix)(props);

            if (__DEV__) {
                setDisplayName(BemClassMix, {
                    wrapper: WithBemClassMix,
                    wrapped: WrappedComponent,
                    value: mix,
                });
            }

            return <WrappedComponent {...newProps} />;
        };
    };
}

function getDisplayName<T>(Component: React.ComponentType<T> | string) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Component';
}

function cnProps(...classes: Array<string | undefined>) {
    return (props: IClassNameProps): any => ({ ...props, className: list(...classes) });
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

    if (displayNameData.isApplied) {
        Component.displayName += '[enabled]';
    }
}

function matchSubset(props: Record<string, any>, match: Record<string, any>) {
    return Object.keys(match).every(key => props[key] === match[key]);
}
