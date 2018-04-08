import { react as naming } from '@bem/sdk.naming.presets';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { createElement as render, PureComponent as Base } from 'react';

import { declareBemCore } from '../../src';

configure({ adapter: new Adapter() });

const { Block, Elem, Bem, mod } = declareBemCore({ render, naming, Base });

export { Block, Elem, Bem, mod, render };
