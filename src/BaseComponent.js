import { Component } from 'react';
import PropTypes from 'prop-types';
import inherit from 'inherit';

let uniqCount = 0;

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
        return {};
    },

    style() {
        return {};
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

    addMix() {
        return null;
    },

    render() {
        const { props } = this,
            attrs = this.attrs(props),
            style = this.style(props),
            res = this.__render(
                this.addBemClassName,
                this.tag(props),
                { ...attrs, style : { ...attrs.style, ...style } },
                this.block,
                this.elem,
                this.mods(props),
                [this.mix(props), this.addMix(props)],
                this.cls(props),
                this.content(props, props.children)
            );

        return this.wrap? this.wrap(res) : res;
    },

    content(_, children) {
        return children;
    },

    getChildContext() {
        if(!this.elem) return { bemBlock : this.block };
    },

    generateId(key = 'uniq') {
        this.__uniqId = this.__uniqId || {};
        return this.__uniqId[key]
            ? this.__uniqId[key]
            : (this.__uniqId[key] = `${key}${++uniqCount}`);
    }
}, {
    childContextTypes : {
        bemBlock : PropTypes.string
    },

    contextTypes : {
        bemBlock : PropTypes.string
    }
});
