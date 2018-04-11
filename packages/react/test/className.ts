import { arrayPart, clsArray, clsString, getNode, mount, shallow } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Bem, Block, Elem, render } = preset;

    describe('Bem', () => {

        describe('Block', () => {
            it('renders simple CSS class', () => {
                expect(clsString(render(Bem, {
                    block: 'Block'
                }))).toBe('Block');
            });

            it('adds extra CSS class', () => {
                expect(clsString(render(Bem, {
                    block: 'Block',
                    className: 'MyCustom'
                }))).toBe('Block MyCustom');
            });

            describe('Modifier', () => {
                it('renders simple CSS class', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        mods: { a: true, b: '1' }
                    }))).toEqual(arrayPart(['Block_a', 'Block_b_1']));
                });

                it('ignores falsy values', () => {
                    expect(clsString(render(Bem, {
                        block: 'Block',
                        mods: { a : false, b : null, c : undefined, d : '', f : '0' }
                    }))).toBe('Block Block_f_0');
                });
            });

            describe('Mix', () => {
                it('renders simple BemJson', () => {
                    expect(clsString(render(Bem, {
                        block: 'Block',
                        mix: { block: 'Block2' }
                    }))).toBe('Block Block2');

                    expect(clsString(render(Bem, {
                        block: 'Block',
                        mix: [{ block: 'Block2' }]
                    }))).toBe('Block Block2');

                    expect(clsString(render(Bem, {
                        block: 'Block',
                        mix: [{
                            block: 'Block2',
                            mods: { mod1: 'val1' }
                        }]
                    }))).toBe('Block Block2 Block2_mod1_val1');
                });

                it('renders nested BemJson', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        mix: {
                            block: 'MixedInstance',
                            mix: {
                                block: 'Nested',
                                mix: { block: 'NestedSimple' },
                                mods: { mod: 'val' }
                            },
                            mods: { mod: 'val' }
                        }
                    }))).toEqual(arrayPart([
                        'Block',
                        'MixedInstance',
                        'MixedInstance_mod_val',
                        'Nested',
                        'Nested_mod_val',
                        'NestedSimple'
                    ]));
                });

                it('renders strings', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        mix: [{ block: 'Block2', mods: { mod1: 'val1' } }, 'StringEntity']
                    }))).toEqual(arrayPart(['Block2', 'Block2_mod1_val1', 'StringEntity']));
                });
            });
        });

        describe('Element', () => {
            it('renders simple CSS class', () => {
                expect(clsString(render(Bem, {
                    block: 'Block',
                    elem: 'Elem'
                }))).toBe('Block-Elem');
            });

            it('adds extra CSS class', () => {
                expect(clsString(render(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    className: 'MyCustom'
                }))).toBe('Block-Elem MyCustom');
            });

            describe('Modifier', () => {
                it('renders simple CSS class', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        elemMods: { a: true, b: '1' }
                    }))).toEqual(arrayPart(['Block-Elem_a', 'Block-Elem_b_1']));
                });

                it('ignores falsy values', () => {
                    expect(clsString(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        elemMods: { a : false, b : null, c : undefined, d : '', f : '0' }
                    }))).toBe('Block-Elem Block-Elem_f_0');
                });

                it('support mods prop', () => {
                    expect(clsString(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mods: { a: true }
                    }))).toBe('Block-Elem Block-Elem_a');
                });

                it('ignores mods prop while elemMods prop exists', () => {
                    expect(clsString(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mods: { a: true },
                        elemMods: { b: 'b' }
                    }))).toBe('Block-Elem Block-Elem_b_b');
                });
            });

            describe('Mix', () => {
                it('renders simple BemJson', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mix: { block: 'Block2', elem: 'Elem2' }
                    }))).toContain('Block2-Elem2');

                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mix: [{
                            block: 'Block2',
                            elem: 'Elem2',
                            mods: { mod1: 'val1' }
                        }]
                    }))).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod1_val1']));

                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mix: [{
                            block: 'Block2',
                            elem: 'Elem2',
                            mods: { mod1: 'val1' },
                            elemMods: { mod2: 'val2' }
                        }]
                    }))).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod2_val2']));
                });

                it('works fine without mods', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mix: [
                            { block: 'b', elem: 'e' },
                            { block: 'b', elem: 'e', mods: { m: 'v' } }
                        ]
                    }))).toEqual(['Block-Elem', 'b-e', 'b-e_m_v']);
                });

                it('supports strings', () => {
                    expect(clsArray(render(Bem, {
                        block: 'Block',
                        elem: 'Elem',
                        mix: [{
                            block: 'Block2',
                            mods: { mod1: 'val1' }
                        }, 'StringEntity']
                    }))).toEqual(arrayPart(['Block2', 'Block2_mod1_val1', 'StringEntity']));
                });
            });

            describe('Context', () => {
                it('infers block', () => {
                    expect(mount(render(Bem, {
                        block: 'Block',
                        children: render(Bem, { elem: 'Elem' })
                    })).find('.Block-Elem')).toHaveLength(1);
                });

                it('not infers block from elem', () => {
                    expect(mount(render(Bem, {
                        block: 'Block',
                        children: render(Bem, {
                            block: 'Block2',
                            elem: 'Elem2',
                            children: render(Bem, { elem: 'Elem' })
                        })
                    })).find('.Block-Elem')).toHaveLength(1);
                });

                it('infers block from Component', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';
                    }
                    expect(mount(render(MyBlock, {
                        children: render(Bem, { elem: 'Elem' })
                    })).find('.MyBlock-Elem')).toHaveLength(1);
                });

                it('infers block in case of nested elems in Component', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';
                    }
                    expect(mount(render(MyBlock, {
                        children: render(Bem, {
                            elem: 'Elem1',
                            children: render(Bem, { elem: 'Elem2' })
                        })
                    })).find('.MyBlock-Elem2')).toHaveLength(1);
                });

                it('infers block in case of nested elems without block', () => {
                    expect(mount(render(Bem, {
                        block: 'Block',
                        elem: 'Elem1',
                        children: render(Bem, { elem: 'Elem2' })
                    })).find('.Block-Elem2')).toHaveLength(1);
                });

                it('infers block from Component based element', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';
                    }
                    class MyElem extends Elem {
                        protected block = 'MyBlock';
                        protected elem = 'MyElem';
                    }

                    expect(mount(render(MyBlock, {
                        children: render(MyElem, {
                            children: render(Bem, { elem: 'Inner' })
                        })
                    })).find('.MyBlock-Inner')).toHaveLength(1);
                });

                it('not infers block in case of nested elems', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';
                    }
                    class MyElem extends Elem {
                        protected block = 'MyBlock';
                        protected elem = 'Elem';

                        protected content() {
                            return render(Bem, { elem: 'InnerElem' });
                        }
                    }
                    expect(mount(render(MyBlock, {
                        children: render(MyElem)
                    })).find('.MyBlock-InnerElem')).toHaveLength(1);
                });

                it('infers block in case of nested elems without parental block', () => {
                    class MyElem extends Elem {
                        protected block = 'MyBlock';
                        protected elem = 'Elem';

                        protected content() {
                            return render(Bem, { elem: 'InnerElem' });
                        }
                    }
                    expect(mount(render(MyElem)).find('.MyBlock-InnerElem')).toHaveLength(1);
                });
            });
        });

        it('Custom naming');
    });

    describe('Component', () => {

        describe('Block', () => {
            it('render simple CSS class', () => {
                class MyBlock extends Block {
                    protected block = 'MyBlock';
                }
                expect(clsString(render(MyBlock))).toBe('MyBlock');
            });

            it('adds extra CSS class', () => {
                class MyBlock extends Block {
                    protected block = 'MyBlock';
                }
                expect(clsString(render(MyBlock, {
                    className: 'MyCustom'
                }))).toBe('MyBlock MyCustom');
            });

            describe('Modifier', () => {
                it('renders simple CSS class', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';

                        protected mods() {
                            return { a: true, b: '1' };
                        }
                    }
                    expect(clsArray(render(MyBlock)))
                        .toEqual(arrayPart(['MyBlock_a', 'MyBlock_b_1']));
                });

                it('ignores falsy values', () => {
                    interface IBProps {
                        a?: boolean;
                        b?: null;
                    }
                    class MyBlock extends Block<IBProps> {
                        protected block = 'MyBlock';

                        protected mods() {
                            return { a: this.props.a, b: this.props.b, c: undefined, d: '', f: '0' };
                        }
                    }
                    expect(clsString(render(MyBlock, {
                        a: false,
                        b: null
                    }))).toBe('MyBlock MyBlock_f_0');
                });
            });

            describe('Mix', () => {
                it('renders simple BemJson', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';

                        protected mix() {
                            return [{
                                block: 'Block2',
                                mods: { mod1: 'val1' }
                            }];
                        }
                    }
                    expect(clsString(render(MyBlock)))
                        .toBe('MyBlock Block2 Block2_mod1_val1');
                });

                it('renders nested BemJson', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';

                        protected mix() {
                            return {
                                block: 'MixedInstance',
                                mix: {
                                    block: 'Nested',
                                    mix: { block: 'NestedSimple' },
                                    mods: { mod: 'val' }
                                },
                                mods: { mod: 'val' }
                            };
                        }
                    }
                    expect(clsArray(render(MyBlock)))
                        .toEqual(arrayPart([
                            'MyBlock',
                            'MixedInstance',
                            'MixedInstance_mod_val',
                            'Nested',
                            'Nested_mod_val',
                            'NestedSimple'
                        ]));
                });

                it('supports strings', () => {
                    class MyBlock extends Block {
                        protected block = 'MyBlock';

                        protected mix() {
                            return [{
                                block: 'Block2',
                                mods: { mod1: 'val1' }
                            }, 'StringEntity'];
                        }
                    }
                    expect(clsArray(render(MyBlock)))
                        .toEqual(arrayPart(['Block2', 'Block2_mod1_val1', 'StringEntity']));
                });

                it('Class attribute mix overrides mix from props');
            });
        });

        describe('Element', () => {
            it('renders simple CSS class', () => {
                class MyElem extends Elem {
                    protected block = 'MyBlock';
                    protected elem = 'Elem';
                }
                expect(clsString(render(MyElem))).toBe('MyBlock-Elem');
            });

            describe('Modifier', () => {
                it('renders simple CSS class', () => {
                    class MyElem extends Elem {
                        protected block = 'MyBlock';
                        protected elem = 'Elem';

                        protected elemMods(props) {
                            return { a: true, b: '1' };
                        }
                    }
                    expect(clsArray(render(MyElem)))
                        .toEqual(arrayPart(['MyBlock-Elem_a', 'MyBlock-Elem_b_1']));
                });

                it('ignores falsy values', () => {
                    interface IBProps {
                        a?: boolean;
                        b?: null;
                    }
                    class MyElem extends Elem<IBProps> {
                        protected block = 'MyBlock';
                        protected elem = 'Elem';

                        protected elemMods(props: IBProps) {
                            return { a: props.a, b: props.b, c: undefined, d: '', f: '0' };
                        }
                    }
                    expect(clsString(render(MyElem, {
                        a: false,
                        b: null
                    }))).toBe('MyBlock-Elem MyBlock-Elem_f_0');
                });
            });
        });

        it('Custom naming');
    });
});
