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

export function withBemMod<P extends IClassNameProps>(mod: NoStrictEntityMods, cb?: ModBody<P>) {
    return function WithBemMod(WrappedComponent: React.ComponentType<P>): React.SFC<P> {
        return function BemMod(props: any) {
            const { className } = WrappedComponent.defaultProps as IClassNameProps;

            if (className === undefined) {
                // TODO: Use invariant instead native errors
                throw new Error(
                    `className not specified in defaultProps of "${getDisplayName(WrappedComponent)}".`,
                );
            }

            const entity = cn(className.split(' ')[0]);

            if (className && Object.keys(mod).every(key => props[key] === mod[key])) {
                const newProps = {
                    ...props,
                    className: classnames(className, entity(mod), props.className),
                };

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
