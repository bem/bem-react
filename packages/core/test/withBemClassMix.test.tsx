import * as React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, ReactWrapper } from 'enzyme';

import { cn } from '@bem-react/classname';
import { IClassNameProps } from '../core';

const el = (wrapper: ReactWrapper) => wrapper.childAt(0);
const getClassName = (wrapper: ReactWrapper) => wrapper.prop('className');

const Presenter: React.SFC<IClassNameProps> = ({ className }) =>
    <div className={cn('Presenter')(null, [className])} />;

describe('withBemClassMix', () => {
    it('should not affect CSS class with undefined', () => {
        expect(getClassName(el(mount(<Presenter/>)))).eq('Presenter');
    });

    it('should add CSS class', () => {
        expect(getClassName(el(mount(<Presenter className="Wow"/>)))).eq('Presenter Wow');
    });

    it('should add spread of CSS classes', () => {
        expect(getClassName(el(mount(<Presenter className="Wow Omg"/>)))).eq('Presenter Wow Omg');
    });

    it('should unify CSS classes', () => {
        expect(getClassName(el(mount(<Presenter className="Extra Wow Omg Extra Nice"/>)))).eq('Presenter Extra Wow Omg Nice');
    });
});
