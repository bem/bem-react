import { Component } from 'react';
import inherit from 'inherit';

export default inherit(Component, {
    __constructor() {
        this.__base(...arguments);
        this.willInit(this.props);
    },

    addBemClassName : true,

    willInit() {},

    tag() {
        return 'div';
    },

    attrs() {
        return null;
    },

    mods() {
        return null;
    },

    cls({ cls }) {
        return cls;
    },

    mix({ mix }) {
        return mix;
    },

    render() {
        const { props } = this,
            res = this.__render(
                this.addBemClassName,
                this.tag(props),
                this.attrs(props),
                this.block,
                this.elem,
                this.mods(props),
                [props.mix, this.mix(props)],
                this.cls(props),
                this.content(props, props.children)
            );

        console.log('render', [props.mix, this.mix(props)]);

        return this.wrap? this.wrap(res) : res;
    },

    content(_, children) {
        return children;
    }
});
