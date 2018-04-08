import { mount, shallow } from 'enzyme';

export const getNode = (node) => shallow(node);
export const getModNode = (node) => shallow(node).dive();
export const clsString = (node) => {
    const props = shallow(node).props() as { className: string };
    return props.className;
};
export const clsArray = (node) => clsString(node).split(' ');
export const arrayPart = expect.arrayContaining;
export { mount, shallow };
