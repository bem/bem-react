import React from 'react';
import { render } from 'enzyme';
import BlockWithRequiredMod from 'b:BlockWithRequiredMod';

it('should have correct order', () => {
    expect(render(<BlockWithRequiredMod/>).text())
        .toEqual('12');
});
