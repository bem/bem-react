import * as React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cn } from '@bem-react/classname';

import { withBemMod, IClassNameProps } from '../core';

const getClassNameFromSelector = (Component: React.ReactElement<any>, selector: string = 'div') =>
    mount(Component).find(selector).prop('className');

const getTypeFromSelector = (Component: React.ReactElement<any>, selector: string = 'button') =>
    mount(Component).find(selector).prop('type');

interface IPresenterProps extends IClassNameProps {
    theme?: 'normal';
    view?: 'default';
}

interface IButtonProps extends IClassNameProps {
    type: string;
}

const presenter = cn('Presenter');
const button = cn('Button');

const Presenter: React.SFC<IPresenterProps> = ({ className }) =>
    <div className={presenter({}, [className])} />;

const Button: React.SFC<IButtonProps> = ({ type = 'button', className}) =>
    <button className={button({}, [className])} type={type} />;

describe('withBemMod', () => {
    it('should not affect CSS class with empty object', () => {
        const WBCM = withBemMod<IPresenterProps>(presenter(), {})(Presenter);
        expect(getClassNameFromSelector(<WBCM className="Additional" />))
            .eq('Presenter Additional');
    });

    it('should add modifier class for matched prop', () => {
        const Enhanced1 = withBemMod<IPresenterProps>(presenter(), { theme: 'normal' })(Presenter);
        const Enhanced2 = withBemMod<IPresenterProps>(presenter(), { view: 'default' })(Enhanced1);
        const Component = <Enhanced2 className="Additional" theme="normal" view="default" />;

        expect(getClassNameFromSelector(Component))
            .eq('Presenter Presenter_theme_normal Presenter_view_default Additional');
    });

    it('should not add modifier class for unmatched prop', () => {
        const WBCM = withBemMod<IPresenterProps>(presenter(), { theme: 'normal' })(Presenter);
        expect(getClassNameFromSelector(<WBCM className="Additional" />))
            .eq('Presenter Additional');
    });

    it('should not pass matched props from withBemMod', () => {
        const WBCM = withBemMod<IButtonProps>(button(), { type: 'link' })(Button);
        expect(getTypeFromSelector(<WBCM className="Additional" type="link" />))
            .eq('button');
    });
});
