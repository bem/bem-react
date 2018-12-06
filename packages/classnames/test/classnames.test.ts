import { describe, it } from 'mocha';
import { expect } from 'chai';

import { classnames } from '../classnames';

describe('@bem-react/classnames', () => {
    describe('classnames', () => {
        it('empty', () => {
            expect(classnames()).to.be.eq('');
        });

        it('undefined', () => {
            expect(classnames('Block', undefined, 'Block2')).to.be.eq('Block Block2');
        });

        it('uniq', () => {
            expect(classnames('CompositeBlock', 'Block', 'Test', 'Block')).to.be.eq('CompositeBlock Block Test');
        });
    });
});
