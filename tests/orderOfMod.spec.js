import { h } from 'preact';
import { deep } from 'preact-render-spy';
import BlockWithRequiredMod from 'b:BlockWithRequiredMod';

it('Should have correct order', () => {
    expect(deep(<BlockWithRequiredMod/>).text()).toEqual('12');
});
