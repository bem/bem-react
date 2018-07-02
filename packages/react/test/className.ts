import { origin } from '@bem/sdk.naming.presets';
import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { arrayPart, clsArray, clsString, mount } from './helpers/node';

type InvalidMods = Record<string, any>;

describe('Bem', () => {

    describe('Block', () => {
        it('renders simple CSS class', () => {
            expect(clsString(createElement(Bem, {
                block: 'Block'
            }))).toBe('Block');
        });

        it('adds extra CSS class', () => {
            expect(clsString(createElement(Bem, {
                block: 'Block',
                className: 'MyCustom'
            }))).toBe('Block MyCustom');
        });

        describe('Modifier', () => {
            it('renders simple CSS class', () => {
                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    mods: { a: true, b: '1' }
                }))).toEqual(arrayPart(['Block_a', 'Block_b_1']));
            });

            it('ignores falsy values', () => {
                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    mods: { a : false, b : null, c : undefined, d : '', f : '0' } as InvalidMods
                }))).toBe('Block Block_f_0');
            });
        });

        describe('Mix', () => {
            it('renders simple BemJson', () => {
                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    mix: { block: 'Block2' }
                }))).toBe('Block Block2');

                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    mix: [{ block: 'Block2' }]
                }))).toBe('Block Block2');

                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    mix: [{
                        block: 'Block2',
                        mods: { mod1: 'val1' }
                    }]
                }))).toBe('Block Block2 Block2_mod1_val1');
            });

            it('renders nested BemJson', () => {
                expect(clsArray(createElement(Bem, {
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
                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    mix: [{ block: 'Block2', mods: { mod1: 'val1' } }, 'StringEntity']
                }))).toEqual(arrayPart(['Block2', 'Block2_mod1_val1', 'StringEntity']));
            });
        });
    });

    describe('Element', () => {
        it('renders simple CSS class', () => {
            expect(clsString(createElement(Bem, {
                block: 'Block',
                elem: 'Elem'
            }))).toBe('Block-Elem');
        });

        it('adds extra CSS class', () => {
            expect(clsString(createElement(Bem, {
                block: 'Block',
                elem: 'Elem',
                className: 'MyCustom'
            }))).toBe('Block-Elem MyCustom');
        });

        describe('Modifier', () => {
            it('renders simple CSS class', () => {
                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    elemMods: { a: true, b: '1' }
                }))).toEqual(arrayPart(['Block-Elem_a', 'Block-Elem_b_1']));
            });

            it('ignores falsy values', () => {
                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    elemMods: { a: false, b: null, c: undefined, d: '', f: '0' } as InvalidMods
                }))).toBe('Block-Elem Block-Elem_f_0');
            });

            it('support mods prop', () => {
                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    mods: { a: true }
                }))).toBe('Block-Elem Block-Elem_a');
            });

            it('ignores mods prop while elemMods prop exists', () => {
                expect(clsString(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    mods: { a: true },
                    elemMods: { b: 'b' }
                }))).toBe('Block-Elem Block-Elem_b_b');
            });
        });

        describe('Mix', () => {
            it('renders simple BemJson', () => {
                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    mix: { block: 'Block2', elem: 'Elem2' }
                }))).toContain('Block2-Elem2');

                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    mix: [{
                        block: 'Block2',
                        elem: 'Elem2',
                        mods: { mod1: 'val1' }
                    }]
                }))).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod1_val1']));

                expect(clsArray(createElement(Bem, {
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
                expect(clsArray(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem',
                    mix: [
                        { block: 'b', elem: 'e' },
                        { block: 'b', elem: 'e', mods: { m: 'v' } }
                    ]
                }))).toEqual(['Block-Elem', 'b-e', 'b-e_m_v']);
            });

            it('supports strings', () => {
                expect(clsArray(createElement(Bem, {
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
                expect(mount(createElement(Bem, {
                    block: 'Block',
                    children: createElement(Bem, { elem: 'Elem' })
                })).find('.Block-Elem')).toHaveLength(1);
            });

            it('not infers block from elem', () => {
                expect(mount(createElement(Bem, {
                    block: 'Block',
                    children: createElement(Bem, {
                        block: 'Block2',
                        elem: 'Elem2',
                        children: createElement(Bem, { elem: 'Elem' })
                    })
                })).find('.Block-Elem')).toHaveLength(1);
            });

            it('infers block from Component', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';
                }
                expect(mount(createElement(MyBlock, {
                    children: createElement(Bem, { elem: 'Elem' })
                })).find('.MyBlock-Elem')).toHaveLength(1);
            });

            it('infers block in case of nested elems in Component', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';
                }
                expect(mount(createElement(MyBlock, {
                    children: createElement(Bem, {
                        elem: 'Elem1',
                        children: createElement(Bem, { elem: 'Elem2' })
                    })
                })).find('.MyBlock-Elem2')).toHaveLength(1);
            });

            it('infers block in case of nested elems without block', () => {
                expect(mount(createElement(Bem, {
                    block: 'Block',
                    elem: 'Elem1',
                    children: createElement(Bem, { elem: 'Elem2' })
                })).find('.Block-Elem2')).toHaveLength(1);
            });

            it('infers block from Component based element', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';
                }
                class MyElem extends Elem {
                    public block = 'MyBlock';
                    public elem = 'MyElem';
                }

                expect(mount(createElement(MyBlock, {
                    children: createElement(MyElem, {
                        children: createElement(Bem, { elem: 'Inner' })
                    })
                })).find('.MyBlock-Inner')).toHaveLength(1);
            });

            it('not infers block in case of nested elems', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';
                }
                class MyElem extends Elem {
                    public block = 'MyBlock';
                    public elem = 'Elem';

                    public content() {
                        return createElement(Bem, { elem: 'InnerElem' });
                    }
                }
                expect(mount(createElement(MyBlock, {
                    children: createElement(MyElem)
                })).find('.MyBlock-InnerElem')).toHaveLength(1);
            });

            it('infers block in case of nested elems without parental block', () => {
                class MyElem extends Elem {
                    public block = 'MyBlock';
                    public elem = 'Elem';

                    public content() {
                        return createElement(Bem, { elem: 'InnerElem' });
                    }
                }
                expect(mount(createElement(MyElem)).find('.MyBlock-InnerElem')).toHaveLength(1);
            });
        });
    });

    it('Custom naming', () => {
        Bem.naming = origin;

        expect(clsString(createElement(Bem, {
            block: 'myblock',
            elem: 'myelem'
        }))).toBe('myblock__myelem');
    });
});

describe('Component', () => {

    describe('Block', () => {
        it('createElement simple CSS class', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }
            expect(clsString(createElement(MyBlock))).toBe('MyBlock');
        });

        it('adds extra CSS class', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }
            expect(clsString(createElement(MyBlock, {
                className: 'MyCustom'
            }))).toBe('MyBlock MyCustom');
        });

        describe('Modifier', () => {
            it('renders simple CSS class', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';

                    public mods() {
                        return { a: true, b: '1' };
                    }
                }
                expect(clsArray(createElement(MyBlock)))
                    .toEqual(arrayPart(['MyBlock_a', 'MyBlock_b_1']));
            });

            it('ignores falsy values', () => {
                interface IBProps {
                    a?: boolean;
                    b?: null;
                }
                class MyBlock extends Block<IBProps> {
                    public block = 'MyBlock';

                    public mods() {
                        return { a: this.props.a, b: this.props.b, c: undefined, d: '', f: '0' } as InvalidMods;
                    }
                }
                expect(clsString(createElement(MyBlock, {
                    a: false,
                    b: null
                }))).toBe('MyBlock MyBlock_f_0');
            });
        });

        describe('Mix', () => {
            it('renders simple BemJson', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';

                    public mix() {
                        return [{
                            block: 'Block2',
                            mods: { mod1: 'val1' }
                        }];
                    }
                }
                expect(clsString(createElement(MyBlock)))
                    .toBe('MyBlock Block2 Block2_mod1_val1');
            });

            it('renders nested BemJson', () => {
                class MyBlock extends Block {
                    public block = 'MyBlock';

                    public mix() {
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
                expect(clsArray(createElement(MyBlock)))
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
                    public block = 'MyBlock';

                    public mix() {
                        return [{
                            block: 'Block2',
                            mods: { mod1: 'val1' }
                        }, 'StringEntity'];
                    }
                }
                expect(clsArray(createElement(MyBlock)))
                    .toEqual(arrayPart(['Block2', 'Block2_mod1_val1', 'StringEntity']));
            });

            it('Class attribute mix overrides mix from props');
        });
    });

    describe('Element', () => {
        it('renders simple CSS class', () => {
            class MyElem extends Elem {
                public block = 'MyBlock';
                public elem = 'Elem';
            }
            expect(clsString(createElement(MyElem))).toBe('MyBlock-Elem');
        });

        describe('Modifier', () => {
            it('renders simple CSS class', () => {
                class MyElem extends Elem {
                    public block = 'MyBlock';
                    public elem = 'Elem';

                    public elemMods() {
                        return { a: true, b: '1' };
                    }
                }
                expect(clsArray(createElement(MyElem)))
                    .toEqual(arrayPart(['MyBlock-Elem_a', 'MyBlock-Elem_b_1']));
            });

            it('ignores falsy values', () => {
                interface IBProps {
                    a?: boolean;
                    b?: null;
                }
                class MyElem extends Elem<IBProps> {
                    public block = 'MyBlock';
                    public elem = 'Elem';

                    public elemMods(props: IBProps) {
                        return { a: props.a, b: props.b, c: undefined, d: '', f: '0' } as InvalidMods;
                    }
                }
                expect(clsString(createElement(MyElem, {
                    a: false,
                    b: null
                }))).toBe('MyBlock-Elem MyBlock-Elem_f_0');
            });
        });
    });

    it('Custom naming', () => {
        Block.naming = origin;

        class MyElem extends Elem {
            public block = 'myblock';
            public elem = 'myelem';
        }

        class MyBlock extends Block {
            public block = 'myblock';
        }

        expect(clsString(createElement(MyElem))).toBe('myblock__myelem');
    });
});
