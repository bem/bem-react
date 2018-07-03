import { mount, shallow } from 'enzyme';
import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';

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

/**
 * https://github.com/airbnb/enzyme/pull/1513
 * This is a temporary solution because enzyme-adapter-react-16 not support new react context yet.
 * After the release delete this code, and react-test-renderer dependency.
 */
export function __render__(node: React.ReactElement<any>) {
    const tree = ReactTestRenderer.create(node);

    return {
        find(selector: string) {
            try {
                const result = tree.root.findByProps({ className: selector.replace(/\./, '') });
                return { ...result, length: 1 };
            } catch (error) {
                return { length: 0 };
            }
        },
        childAt(index: number) {
            const result = tree.toJSON().children[index];
            return {
                prop(key: string) {
                    return result.props[key];
                }
            };
        }
    };
}

export function getClassName(node: ReactElement<any>) {
    return ReactTestRenderer.create(node).toJSON().props.className;
}

export function getClassNameArray(node: ReactElement<any>) {
    return getClassName(node).split(' ');
}
