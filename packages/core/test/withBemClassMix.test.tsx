import * as React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, ReactWrapper } from 'enzyme';

import { withBemClassMix, IClassNameProps } from '../core';

// const el = (wrapper: ReactWrapper) => wrapper.childAt(0);
const elInHoc = (wrapper: ReactWrapper) => wrapper.childAt(0).childAt(0);
const cn = (wrapper: ReactWrapper) => wrapper.prop('className');

const Presenter: React.SFC<IClassNameProps> = ({ className = '' }) =>
    <div className={'Presenter ' + className} />;

describe('withBemClassMix', () => {
    it('should not affect CSS class with undefined', () => {
        const WBCM = withBemClassMix()(Presenter);
        expect(cn(elInHoc(mount(<WBCM/>)))).eq('Presenter ');
    });

    it('should add CSS class', () => {
        const WBCM = withBemClassMix('Wow')(Presenter);
        expect(cn(elInHoc(mount(<WBCM/>)))).eq('Presenter Wow');
    });

    it('should add spread of CSS classes', () => {
        const WBCM = withBemClassMix('Wow', 'Omg')(Presenter);
        expect(cn(elInHoc(mount(<WBCM/>)))).eq('Presenter Wow Omg');
    });

    it('should merge className prop', () => {
        const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Wow', 'Omg')(Presenter);
        expect(cn(elInHoc(mount(<WBCM className="Extra"/>)))).eq('Presenter Extra Wow Omg');
    });

    it('should unify CSS classes', () => {
        const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Wow', 'Omg', 'Extra', 'Nice')(Presenter);
        expect(cn(elInHoc(mount(<WBCM className="Extra"/>)))).eq('Presenter Extra Wow Omg Nice');
    });

    describe('devTools', () => {
        it('should set self name to vnode without val', () => {
            const WBCM: React.SFC<IClassNameProps> = withBemClassMix()(Presenter);
            mount(<WBCM/>);

            expect(WBCM.displayName).eq('WithBemClassMix(Presenter)');
        });

        it('should set alone val and self name to vnode', () => {
            const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix')(Presenter);
            mount(<WBCM/>);

            expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix]');
        });

        it('should set multiple vals and self name to vnode', () => {
            const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix1', 'Mix2')(Presenter);
            mount(<WBCM/>);

            expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix1 | Mix2]');
        });

        it('should ignore val in className prop', () => {
            const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix1', 'Mix2')(Presenter);
            mount(<WBCM className="Extra"/>);

            expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix1 | Mix2]');
        });
    });
});
