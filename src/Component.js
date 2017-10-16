import inherit from 'inherit';

import Base from './Base';

let uniqCount = 0;

export default inherit(Base, {
    __constructor() {
        this.__base(...arguments);
        this.willInit(this.props);
    },

    bem : true,

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
            res = this.__render({
                bem : this.bem,
                tag : this.tag(props),
                attrs : { ...attrs, style : { ...attrs.style, ...style } },
                block : this.block,
                elem : this.elem,
                mods : this.mods(props),
                mix : [this.mix(props), this.addMix(props)],
                cls : this.cls(props),
                children : this.content(props, props.children)
            });

        return this.wrap? this.wrap(res) : res;
    },

    content({ children }) {
        return children;
    },

    generateId(key = 'uniq') {
        this.__uniqId = this.__uniqId || {};
        return this.__uniqId[key]
            ? this.__uniqId[key]
            : (this.__uniqId[key] = `${key}${++uniqCount}`);
    }
});
