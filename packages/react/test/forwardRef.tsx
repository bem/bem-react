import * as React from 'react';
import { createRef } from 'react';
import { Bem, Block } from '../src';
import { mount } from './helpers/node';

describe('forwardRef', () => {
    describe('Bem', () => {
        it('should attach and detach ref with function', () => {
            let ref = null;
            const wrapper = mount((
                <Bem block="MyBlock" forwardRef={(node) => ref = node} />
            ));

            expect(ref.className).toBe('MyBlock');
            wrapper.unmount();
            expect(ref).toBe(null);
        });

        it('should attach and detach ref with createRef', () => {
            const ref = createRef();
            const wrapper = mount((
                <Bem block="MyBlock" forwardRef={ref} />
            ));

            // @ts-ignore (current has HTMLDivElement and them has className)
            expect(ref.current.className).toBe('MyBlock');
            wrapper.unmount();
            expect(ref.current).toBe(null);
        });
    });

    describe('Block', () => {
        it('should attach and detach ref with function', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }

            let ref = null;
            const wrapper = mount((
                <MyBlock forwardRef={(node) => ref = node} />
            ));

            expect(ref.className).toBe('MyBlock');
            wrapper.unmount();
            expect(ref).toBe(null);
        });

        it('should attach and detach ref with createRef', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }

            const ref = createRef();
            const wrapper = mount((
                <MyBlock forwardRef={ref} />
            ));

            // turn update for attach ref
            wrapper.update();
            // @ts-ignore (current has HTMLDivElement and them has className)
            expect(ref.current.className).toBe('MyBlock');
            wrapper.unmount();
            expect(ref.current).toBe(null);
        });

        it('should attach and detach ref override with function', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
                public content() {
                    return (
                        <div className="MyBlock-Wrapper" ref={this.attachForwardRef}>
                            {this.props.children}
                        </div>
                    );
                }
            }

            let ref = null;
            const wrapper = mount((
                <MyBlock forwardRef={(node) => ref = node} />
            ));

            expect(ref.className).toBe('MyBlock-Wrapper');
            wrapper.unmount();
            expect(ref).toBe(null);
        });

        it('should attach and detach ref override with createRef', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
                public content() {
                    return (
                        <div className="MyBlock-Wrapper" ref={this.attachForwardRef}>
                            {this.props.children}
                        </div>
                    );
                }
            }

            const ref = createRef();
            const wrapper = mount((
                <MyBlock forwardRef={ref} />
            ));

            // turn update for attach ref
            wrapper.update();
            // @ts-ignore (current has HTMLDivElement and them has className)
            expect(ref.current.className).toBe('MyBlock-Wrapper');
            wrapper.unmount();
            expect(ref.current).toBe(null);
        });
    });
});
