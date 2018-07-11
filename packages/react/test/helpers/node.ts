import { mount, shallow } from 'enzyme';
import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';

export const getNode = (node: React.ReactElement<{}>) => shallow(node);
export const getMountedNode = (node: React.ReactElement<{}>) => {
    // Use mount instead shallow because shallow cannot render children as function
    // Get zero child because component should have context wrapper
    return mount(node).childAt(0);
};
export const getModNode = (node: React.ReactElement<{}>) => shallow(node).dive();
export const clsString = (node: React.ReactElement<{}>) => {
    return getMountedNode(node).prop('className');
};
export const clsArray = (node: React.ReactElement<{}>) => clsString(node).split(' ');
export const arrayPart = expect.arrayContaining;
export { mount, shallow };
