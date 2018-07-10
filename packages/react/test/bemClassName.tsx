import { origin, react } from '@bem/sdk.naming.presets';
import * as React from 'react';

import { bemClassName, Block, Elem } from '../src';
import { getMountedNode } from './helpers/node';

describe('bemClassName:', () => {
    it('should return classname', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public content() {
                return (
                    <div className={this.bemClassName('MyElem')} />
                );
            }
        }

        class MyElem extends Elem {
            public block = 'MyBlock';
            public elem = 'MyElem';
            public content() {
                return (
                    <div className={this.bemClassName({ theme: 'normal' })} />
                );
            }
        }

        class MyBlock1 extends Block {
            public block = 'myblock1';
            public content() {
                return (
                    <div className={bemClassName(origin)('myblock2', 'myelem2')} />
                );
            }
        }

        expect(getMountedNode(<MyBlock />).find('.MyBlock-MyElem')).toHaveLength(1);
        expect(getMountedNode(<MyElem />).find('.MyBlock-MyElem_theme_normal')).toHaveLength(1);
        expect(getMountedNode(<MyBlock1 />).find('.myblock2__myelem2')).toHaveLength(1);
    });
});
