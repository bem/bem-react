import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import Bem from 'bem-react-core';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';

describe('Entity without declaration', () => {
    it('Entity should have passed content', () => {
        expect(shallow(<Bem block="Block">content</Bem>).text()).toBe('content');
    });
});

describe('Entity with declaration', () => {
    it('Entity should have passed content', () => {
        expect(shallow(<SimpleBlock>content</SimpleBlock>).text())
            .toBe('content');
    });

    it('Entity should have declared content', () => {
        expect(shallow(<MyBlock>extend</MyBlock>).text())
            .toBe('contentextend');
    });
});
