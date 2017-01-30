import React from 'react';
import { render } from 'enzyme';
import BlockWithRequiredMod from 'b:BlockWithRequiredMod';

it('Should have correct order', () => {
    expect(render(<BlockWithRequiredMod/>).text())
        .toEqual('12');
});
