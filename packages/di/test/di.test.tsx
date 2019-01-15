// tslint:disable no-shadowed-variable
import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { render } from 'enzyme';

import { Registry, withRegistry, RegistryConsumer, ComponentRegistryConsumer } from '../di';

interface ICommonProps {
    className?: string;
}

describe('@bem-react/di', () => {
    describe('Registry', () => {
        it('should set and components by id', () => {
            const registry = new Registry({ id: 'registry' });
            const Component1 = () => null;
            const Component2 = () => <span/>;

            registry
                .set('id-1', Component1)
                .set('id-2', Component2);

            expect(registry.get('id-1')).to.eq(Component1);
            expect(registry.get('id-2')).to.eq(Component2);
        });

        it('should return list of components', () => {
            const registry = new Registry({ id: 'registry' });
            const Component1 = () => null;
            const Component2 = () => <span/>;

            registry
                .set('id-1', Component1)
                .set('id-2', Component2);

            const snapshot = {
                'id-1': Component1,
                'id-2': Component2,
            };

            expect(registry.snapshot()).to.eql(snapshot);
        });

        it('should merge registries', () => {
            const registry = new Registry({ id: 'registry' });
            const Component1 = () => null;
            const Component2 = () => <span/>;

            registry
                .set('id-1', Component1)
                .set('id-2', Component2);

            const overrides = new Registry({ id: 'overrides' });
            const Component1Overrided = () => <div/>;

            overrides.set('id-1', Component1Overrided);

            const snapshot = {
                'id-1': Component1Overrided,
                'id-2': Component2,
            };

            expect(registry.merge(overrides).snapshot()).to.eql(snapshot);
        });

        it('should not affect registry in merge with undefined', () => {
            const registry = new Registry({ id: 'registry' });
            const Component1 = () => null;
            const Component2 = () => <span/>;

            registry
                .set('id-1', Component1)
                .set('id-2', Component2);

            const snapshot = {
                'id-1': Component1,
                'id-2': Component2,
            };

            // @ts-ignore to check inside logic
            expect(registry.merge().snapshot()).to.eql(snapshot);
        });

        it('should throw error when component doesn\'t exist', () => {
            const registry = new Registry({ id: 'registry' });

            expect(() => registry.get('id')).to.throw('Component with id \'id\' not found.');
        });
    });

    describe('withRegistry', () => {
        it('should provide registry to context', () => {
            const compositorRegistry = new Registry({ id: 'Compositor' });
            const Element: React.SFC<ICommonProps> = () => <span>content</span>;

            interface ICompositorRegistry {
                Element: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element', Element);

            const CompositorPresenter: React.SFC<ICommonProps> = () => (
                <RegistryConsumer>
                    {registries => {
                        const registry = registries['Compositor'];
                        const { Element } = registry.snapshot<ICompositorRegistry>();

                        return <Element/>;
                    }}
                </RegistryConsumer>
            );

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);

            expect(render(<Compositor/>).text()).eq('content');
        });

        it('should provide assign registry with component', () => {
            const compositorRegistry = new Registry({ id: 'Compositor' });
            const Element: React.SFC<ICommonProps> = () => <span>content</span>;

            interface ICompositorRegistry {
                Element: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element', Element);

            const CompositorPresenter: React.SFC<ICommonProps> = () => (
                <ComponentRegistryConsumer id="Compositor">
                    {({ Element }: ICompositorRegistry) => <Element/>}
                </ComponentRegistryConsumer>
            );

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);

            expect(render(<Compositor/>).text()).eq('content');
        });

        it('should override components in registry by context', () => {
            const compositorRegistry = new Registry({ id: 'Compositor' });
            const Element: React.SFC<ICommonProps> = () => <span>content</span>;

            const overridedCompositorRegistry = new Registry({ id: 'Compositor' });
            const OverridedElement: React.SFC<ICommonProps> = () => <span>overrided</span>;

            interface ICompositorRegistry {
                Element: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element', Element);
            overridedCompositorRegistry.set('Element', OverridedElement);

            const CompositorPresenter: React.SFC<ICommonProps> = () => {
                const Content: React.SFC<ICommonProps> = withRegistry(overridedCompositorRegistry)(() => (
                    <ComponentRegistryConsumer id="Compositor">
                        {({ Element }: ICompositorRegistry) => <Element/>}
                    </ComponentRegistryConsumer>
                ));

                return <Content/>;
            };

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);

            expect(render(<Compositor/>).text()).eq('overrided');
        });

        it('should override components in registry from top node', () => {
            const compositorRegistry = new Registry({ id: 'Compositor', inverted: true });
            const Element: React.SFC<ICommonProps> = () => <span>content</span>;

            const overridedCompositorRegistry = new Registry({ id: 'Compositor' });
            const OverridedElement: React.SFC<ICommonProps> = () => <span>overrided</span>;

            interface ICompositorRegistry {
                Element: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element', Element);
            overridedCompositorRegistry.set('Element', OverridedElement);

            const CompositorPresenter: React.SFC<ICommonProps> = () => (
                <ComponentRegistryConsumer id="Compositor">
                    {({ Element }: ICompositorRegistry) => <Element/>}
                </ComponentRegistryConsumer>
            );

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);
            const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor);

            expect(render(<Compositor/>).text()).eq('content');
            expect(render(<OverridedCompositor/>).text()).eq('overrided');
        });

        it('should partially override components in registry', () => {
            const compositorRegistry = new Registry({ id: 'Compositor', inverted: true });
            const Element1: React.SFC<ICommonProps> = () => <span>content</span>;
            const Element2: React.SFC<ICommonProps> = () => <span>extra</span>;

            const overridedCompositorRegistry = new Registry({ id: 'Compositor' });
            const OverridedElement: React.SFC<ICommonProps> = () => <span>overrided</span>;

            interface ICompositorRegistry {
                Element1: React.ComponentType<ICommonProps>;
                Element2: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element1', Element1);
            compositorRegistry.set('Element2', Element2);
            overridedCompositorRegistry.set('Element1', OverridedElement);

            const CompositorPresenter: React.SFC<ICommonProps> = () => (
                <ComponentRegistryConsumer id="Compositor">
                    {({ Element1, Element2 }: ICompositorRegistry) => (
                        <>
                            <Element1/>
                            <Element2/>
                        </>
                    )}
                </ComponentRegistryConsumer>
            );

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);
            const OverridedCompositor = withRegistry(overridedCompositorRegistry)(Compositor);

            expect(render(<Compositor/>).text()).eq('contentextra');
            expect(render(<OverridedCompositor/>).text()).eq('overridedextra');
        });

        it('should allow to use any registry in context', () => {
            const compositorRegistry = new Registry({ id: 'Compositor', inverted: true });
            const element2Registry = new Registry({ id: 'Element2', inverted: true });
            const Element1: React.SFC<ICommonProps> = () => <span>content</span>;
            const Element2Presenter: React.SFC<ICommonProps> = () => (
                <ComponentRegistryConsumer id="Compositor">
                    {({ Element }: ICompositorRegistry) => <><Element/>extra</>}
                </ComponentRegistryConsumer>
            );
            const Element2 = withRegistry(element2Registry)(Element2Presenter);

            interface ICompositorRegistry {
                Element: React.ComponentType<ICommonProps>;
                Element2: React.ComponentType<ICommonProps>;
            }

            compositorRegistry.set('Element', Element1);
            compositorRegistry.set('Element2', Element2);

            const CompositorPresenter: React.SFC<ICommonProps> = () => (
                <ComponentRegistryConsumer id="Compositor">
                    {({ Element2 }: ICompositorRegistry) => <Element2/>}
                </ComponentRegistryConsumer>
            );

            const Compositor = withRegistry(compositorRegistry)(CompositorPresenter);

            expect(render(<Compositor/>).text()).eq('contentextra');
        });
    });
});
