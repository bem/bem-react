import * as React from 'react';
import { ClassNameFormatter } from '@bem-react/classname';

export type NoStrictMods = Record<string, string | boolean | number | undefined>;

export interface IClassNameProps {
    className?: string;
}

export type ModBody<P> = (Block: React.SFC<P>, props: P) => JSX.Element;
export type ModMatch = Record<string, string | boolean | number>;

interface IDisplayNameData {
    wrapper: any;
    wrapped: any;
    value: any;
    isApplied?: boolean;
}

export function withBemClassName<P extends IClassNameProps>(
    cn: ClassNameFormatter,
    mapPropsToBemMods: (props: P) => NoStrictMods | undefined = () => undefined,
) {
    return function WithBemClassName(WrappedComponent: any): React.SFC<P> {
        return function BemClassName(props: P) {
            const newProps: P = cnProps(cn(), cn(mapPropsToBemMods(props)), props.className)(props);

            if (__DEV__) {
                setDisplayName(BemClassName, {
                    wrapper: WithBemClassName,
                    wrapped: WrappedComponent,
                    value: classnames(cn(), cn(mapPropsToBemMods(props))),
                });
            }

            return <WrappedComponent {...newProps} />;

        };
    };
}

export function withBemMod<P extends IClassNameProps>(cn: ClassNameFormatter, mod: NoStrictMods, cb?: ModBody<P>) {
    return function WithBemMod(WrappedComponent: React.SFC<P>) {
        return function BemMod(props: P) {
            if (matchSubset(props, mod)) {
                const newProps: P = cnProps(props.className, cn(mod))(props);

                if (__DEV__) {
                    setDisplayName(BemMod, {
                        wrapper: WithBemMod,
                        wrapped: cn(),
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
                    wrapped: cn(),
                    value: mod,
                });
            }

            return <WrappedComponent {...props}/>;
        };
    };
}

export function withBemClassMix<P extends IClassNameProps>(...mix: Array<string | undefined>) {
    return (WrappedComponent: React.ComponentType<P>) => {
        return function WithBemClassMix(props: P) {
            const newProps: P = cnProps(props.className, ...mix)(props);

            if (__DEV__) {
                setDisplayName(WithBemClassMix, {
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

function cnProps<P>(...classes: Array<string | undefined>) {
    return (props: IClassNameProps): any => ({ ...props, className: classnames(...classes) });
}

function classnames(...args: Array<string | undefined>) {
    const classNames: string[] = [];

    args.forEach(className => {
        if (className) {
            className.split(' ').forEach(part => {
                if (classNames.indexOf(part) === -1) {
                    classNames.push(part);
                }
            });
        }
    });

    return classNames.join(' ');
}

function setDisplayName(Component: React.ComponentType<any>, displayNameData: IDisplayNameData) {
    const value = JSON.stringify(displayNameData.value)
        .replace(/\{|\}|\"/g, '')
        .replace(/,/, ' | ');
    const wrapperName = getDisplayName(displayNameData.wrapper);
    const wrappedName = typeof displayNameData.wrapped === 'string'
        ? displayNameData.wrapped
        : getDisplayName(displayNameData.wrapped);

    // Wrapper(WrappedComponent)[applied values][is applied]
    Component.displayName = `${wrapperName}(${wrappedName})[${value}]`;

    if (displayNameData.isApplied) {
        Component.displayName += '[enabled]';
    }
}

function matchSubset(props: Record<string, any>, match: Record<string, any>) {
    return Object.keys(match).every(key => props[key] === match[key]);
}
