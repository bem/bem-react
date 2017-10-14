import { h } from 'preact';
import { deep } from 'preact-render-spy';
import MyBlock from 'b:MyBlock';

it('Should generate id', () => {
    expect(deep(<MyBlock/>).output().attributes.id).toMatch(/uniq\d+$/);
});
