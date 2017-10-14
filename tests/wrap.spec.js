import { h } from 'preact';
import { deep } from 'preact-render-spy';

import WrappedBlock from 'b:WrappedBlock';

it('Entity should have declared wrapper', () => {
    const getClassName = node => node.attributes.class,
        wrapper = deep(<WrappedBlock/>).output(),
        wrappedBlock = wrapper.children[0];

    expect(getClassName(wrapper)).toBe('Wrapper');
    expect(getClassName(wrappedBlock)).toBe('WrappedBlock');
});
