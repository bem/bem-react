import * as React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, ReactWrapper } from 'enzyme';
import { cn } from '@bem-react/classname';

import { withBemMod, IClassNameProps } from '../core';

// const el = (wrapper: ReactWrapper) => wrapper.childAt(0);
const elInHoc = (wrapper: ReactWrapper) => wrapper.childAt(0).childAt(0);
const getClassName = (wrapper: ReactWrapper) => wrapper.prop('className');

interface IPresenterProps extends IClassNameProps {
    theme?: 'normal';
    view?: 'default';
}

const presenter = cn('Presenter');

const Presenter: React.SFC<IPresenterProps> = ({ className }) =>
    <div className={presenter({}, [className])} />;

Presenter.defaultProps = {
    className: presenter(),
};

describe('withBemMod', () => {
    it('should not affect CSS class with empty object', () => {
        const WBCM = withBemMod<IPresenterProps>({})(Presenter);
        expect(getClassName(elInHoc(mount(<WBCM className="Additional" />))))
            .eq('Presenter Additional');
    });

    it('should add modifier class for matched prop', () => {
        const Enhanced1 = withBemMod<IPresenterProps>({ theme: 'normal' })(Presenter);
        const Enhanced2 = withBemMod<IPresenterProps>({ view: 'default' })(Enhanced1);
        const Component = <Enhanced2 className="Additional" theme="normal" view="default" />;

        expect(getClassName(elInHoc(mount(Component))))
            .eq('Presenter Presenter_theme_normal Presenter_view_default Additional');
    });

    it('should not add modifier class for unmatched prop', () => {
        const WBCM = withBemMod<IPresenterProps>({ theme: 'normal' })(Presenter);
        expect(getClassName(elInHoc(mount(<WBCM className="Additional" />))))
            .eq('Presenter Additional');
    });

    it('should throw error when className not specified in defaultProps', () => {
        const View = () => <div />;
        const Enhanced = withBemMod({})(View);

        expect(Enhanced).throw('className not specified in defaultProps of "View"');
    });

    // it('should add CSS class', () => {
    //     const WBCM = withBemClassMix('Wow')(Presenter);
    //     expect(cn(elInHoc(mount(<WBCM/>)))).eq('Presenter Wow');
    // });

    // it('should add spread of CSS classes', () => {
    //     const WBCM = withBemClassMix('Wow', 'Omg')(Presenter);
    //     expect(cn(elInHoc(mount(<WBCM/>)))).eq('Presenter Wow Omg');
    // });

    // it('should merge className prop', () => {
    //     const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Wow', 'Omg')(Presenter);
    //     expect(cn(elInHoc(mount(<WBCM className="Extra"/>)))).eq('Presenter Extra Wow Omg');
    // });

    // it('should unify CSS classes', () => {
    //     const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Wow', 'Omg', 'Extra', 'Nice')(Presenter);
    //     expect(cn(elInHoc(mount(<WBCM className="Extra"/>)))).eq('Presenter Extra Wow Omg Nice');
    // });

    // describe('devTools', () => {
    //     it('should set self name to vnode without val', () => {
    //         const WBCM: React.SFC<IClassNameProps> = withBemClassMix()(Presenter);
    //         mount(<WBCM/>);

    //         expect(WBCM.displayName).eq('WithBemClassMix(Presenter)');
    //     });

    //     it('should set alone val and self name to vnode', () => {
    //         const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix')(Presenter);
    //         mount(<WBCM/>);

    //         expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix]');
    //     });

    //     it('should set multiple vals and self name to vnode', () => {
    //         const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix1', 'Mix2')(Presenter);
    //         mount(<WBCM/>);

    //         expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix1 | Mix2]');
    //     });

    //     it('should ignore val in className prop', () => {
    //         const WBCM: React.SFC<IClassNameProps> = withBemClassMix('Mix1', 'Mix2')(Presenter);
    //         mount(<WBCM className="Extra"/>);

    //         expect(WBCM.displayName).eq('WithBemClassMix(Presenter)[Mix1 | Mix2]');
    //     });
    // });
});
