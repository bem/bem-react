import React, { PropTypes } from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock m:theme=simple';
import InheritedBlock from 'b:InheritedBlock';

it('Should merge propTypes for modifier', () => {
    expect(MyBlock.propTypes).toMatchObject({
        disabled : PropTypes.bool,
        theme : PropTypes.string,
        size : PropTypes.string
    });
});

it('Should merge propTypes for inherited', () => {
    expect(InheritedBlock.propTypes).toMatchObject({
        disabled : PropTypes.bool,
        checked : PropTypes.bool
    });
});

it('Should merge propTypes for levels', () => {
    expect(MyBlock.propTypes).toMatchObject({
        disabled : PropTypes.bool,
        a11y : PropTypes.bool
    });
});

