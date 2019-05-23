import React from 'react';
import { assert } from 'chai';
import { describe, it } from 'mocha';
import { ComponentType } from 'react';
import { compose, composeU } from '../core';

type BaseProps = {
    text: string;
};

type HoveredProps = {
    hovered?: boolean;
};

type ThemeAProps = {
    theme?: 'a';
};

type ThemeBProps = {
    theme?: 'b';
};

const BaseComponent = (props: BaseProps) => null;
const hoveredComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: HoveredProps) => null;
const themeAComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: ThemeAProps) => null;
const themeBComponent = <T extends any>(Wrapped: ComponentType<T>) => (props: ThemeBProps) => null;

const EnahncedComponent = compose(
    hoveredComponent,
    composeU(themeAComponent, themeBComponent),
)(BaseComponent);

describe('compose', () => {
    it('should compile component with theme a', () => {
        <EnahncedComponent theme="a" text="" />;
        assert(true);
    });

    it('should compile component with theme b', () => {
        <EnahncedComponent theme="b" text="" />;
        assert(true);
    });

    it('should compile component with hovered true', () => {
        <EnahncedComponent hovered text="" />;
        assert(true);
    });
});
