import React from 'react';
import { render } from 'enzyme';
import Bem from 'bem-react-core';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';

describe('Entity without declaration', () => {
    it('Entity should have passed content', () => {
        expect(render(<Bem block="Block">content</Bem>).text()).toBe('content');
    });
});

describe('Entity with declaration', () => {
    it('Entity should have passed content', () => {
        expect(render(<SimpleBlock>content</SimpleBlock>).text())
            .toBe('content');
    });

    it('Entity should have declared content', () => {
        expect(render(<MyBlock>extend</MyBlock>).text())
            .toBe('contentextend');
    });
});
