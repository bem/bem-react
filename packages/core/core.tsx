import * as React from 'react';
import { EntityFormatter } from '@bem-react/classname';

export type NoStrictMods = Record<string, string | boolean | number | undefined>;

export interface IClassNameProps {
    className?: string;
}

export type ModBody<P> = (Block: React.SFC<P>, props: P) => JSX.Element;
export type ModMatch = Record<string, string | boolean | number>;

function getDisplayName<T>(Component: React.ComponentType<T> | string) {
    if (typeof Component === 'string') {
        return Component;
    }

    return Component.displayName || Component.name || 'Component';
}

interface IDisplayNameData {
    wrapper: any;
    wrapped: any;
    value: any;
}

function setDisplayName(Component: React.ComponentType<any>, displayNameData: IDisplayNameData) {
    const value = JSON.stringify(displayNameData.value)
        .replace(/\{|\}|\"/g, '')
        .replace(/,/, ' | ');
    const wrapperName = getDisplayName(displayNameData.wrapper);
    const wrappedName = getDisplayName(displayNameData.wrapped);

    // Wrapper(WrappedComponent)[applied values][is applied]
    Component.displayName = `${wrapperName}(${wrappedName})[${value}]`;
}

export const matchSubset = (
    props: Record<string, any>,
    match: Record<string, any>,
) => Object.keys(match).every(key => props[key] === match[key]);

export function withBemClassName<P extends IClassNameProps>(
    entity: EntityFormatter,
    mapPropsToBemMods?: (props: P) => NoStrictMods,
) {
    return function WithBemClassName(WrappedComponent: any): React.SFC<P> {
        return function BemClassName(props: P) {
            const mods = mapPropsToBemMods ? entity(mapPropsToBemMods(props)) : undefined;
            const bemClassName = classnames(String(entity), mods);
            const className = classnames(bemClassName, props.className);
            const newProps = Object.assign({}, props, { className });

            if (__DEV__) {
                setDisplayName(BemClassName, {
                    wrapper: WithBemClassName,
                    wrapped: WrappedComponent,
                    value: bemClassName,
                });
            }

            return <WrappedComponent {...newProps} />;

        };
    };
}

export function withBemMod<P extends IClassNameProps>(
    entity: EntityFormatter,
    mod: NoStrictMods,
    cb?: ModBody<P>,
) {
    return function WithBemMod(WrappedComponent: React.SFC<P>) {
        return function BemMod(props: P) {
            if (matchSubset(props, mod)) {
                const newProps = Object.assign({}, props, {
                    className: classnames(props.className, entity(mod)),
                });

                // BemMod.displayName = `WithBemMod(${JSON.stringify(mod)}, true)`;

                return cb ? cb(WrappedComponent, newProps) : <WrappedComponent {...newProps} />;
            }

            if (__DEV__) {
                setDisplayName(BemMod, {
                    wrapper: WithBemMod,
                    wrapped: WrappedComponent,
                    value: mod,
                });
            }

            return <WrappedComponent {...props}/>;
        };
    };
}

export function withBemClassMix<P extends IClassNameProps>(...mix: string[]) {
    return (WrappedComponent: React.ComponentType<P>) => {
        return function WithBemClassMix(props: P) {
            const newProps = Object.assign({}, props, {
                className: classnames(props.className, ...mix),
            });

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

export const classnames = (...args: Array<string | undefined>) => {
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
};
