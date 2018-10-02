import { expect } from 'chai';

import { Registry } from '../di';

describe('@bem-react/di', () => {
    describe('Registry', () => {
        it('should set components and return this by id', () => {
            const registry = new Registry({ id: 'id' });
            const Component1 = () => null;
            const Component2 = () => null;

            registry
                .set('id-1', Component1)
                .set('id-2', Component2);

            expect(registry.get('id-1')).to.equal(Component1);
            expect(registry.get('id-2')).to.equal(Component2);
        });
    });

    describe.skip('withRegistry', () => {
        // TODO: Add test for withRegistry
        return null;
    });
});
