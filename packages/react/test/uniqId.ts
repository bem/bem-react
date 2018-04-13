import { getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Block, render } = preset;

    describe('UniqId:', () => {
        it('generates unique id', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';

                protected attrs() {
                    return { id: this.generateId() };
                }
            }
            expect(getNode(render(MyBlock, {})).prop('id')).toMatch(/uniq\d+$/);
        });

        it('resets id counter', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';

                constructor(props: any) {
                    super(props);
                    this.resetId();
                }

                protected attrs() {
                    return { id: this.generateId() };
                }
            }
            expect(getNode(render(MyBlock, {})).prop('id')).toBe('uniq1');
        });
    });
});
