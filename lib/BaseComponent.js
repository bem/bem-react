import { Component } from 'react';
import inherit from 'inherit';

export default inherit(Component, {
    __constructor() {
        this.__base.apply(this, arguments);
        this.willInit(this.props);
    },

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

    cls() {
        return '';
    },

    mix() {
        return null;
    },

    render() {
        const { props } = this,
            res = this.__render(
                this.tag(props),
                this.attrs(props),
                this.block,
                this.elem,
                this.mods(props),
                [props.mix, this.mix(props)],
                this.cls(props),
                this.content(props, props.children)
            );

        return this.wrap? this.wrap(res) : res;
    },

    content(_, children) {
        return children;
    }
});
