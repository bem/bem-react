import { mount, shallow } from 'enzyme';
import * as React from 'react';

export const getNode = (node: React.ReactElement<{}>) => shallow(node);
export const getMountedNode = (node: React.ReactElement<{}>) => mount(node);
export const getModNode = (node: React.ReactElement<{}>) => shallow(node).dive();
export const clsString = (node: React.ReactElement<{}>) => {
    const props = shallow(node).props() as { className: string };
    return props.className;
};
export const clsArray = (node: React.ReactElement<{}>) => clsString(node).split(' ');
export const arrayPart = expect.arrayContaining;
export { mount, shallow };
