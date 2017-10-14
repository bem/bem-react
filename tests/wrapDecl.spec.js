import { h } from 'preact';
import { deep } from 'preact-render-spy';
import BlockWithWrapDecl from 'b:BlockWithWrapDecl';

it('Entity should have hook', () => {
    const wrapper = deep(<BlockWithWrapDecl id="1"/>).output();

    expect(wrapper.attributes).toMatchObject({
        tabIndex : '-1',
        id : '1'
    });
});
