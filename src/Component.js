import inherit from 'inherit';

let uniqCount = 0;
const noop = () => {},
    prop = name => props => props[name];

export default function(Bem) {
    return inherit(Bem, {
        __constructor() {
            this.__base(...arguments);
            this.willInit(this.props);
        },

        addBemClassName : () => true,
        willInit : noop,
        tag : noop,
        attrs : noop,
        style : noop,
        mods : noop,
        addMix : noop,
        cls : prop('cls'),
        mix : prop('mix'),
        content : prop('children'),

        render() {
            const { props } = this,
                attrs = this.attrs(props) || {},
                style = this.style(props) || {},
                res = this.__render({
                    addBemClassName : this.addBemClassName(props),
                    tag : this.tag(props),
                    attrs : { ...attrs, style : { ...attrs.style, ...style } },
                    block : this.block,
                    elem : this.elem,
                    mods : this.mods(props),
                    mix : [].concat(this.mix(props), this.addMix(props)),
                    cls : this.cls(props),
                    children : this.content(props, props.children)
                });

            return this.wrap? this.wrap(res) : res;
        },

        generateId(key = 'uniq') {
            this.__uniqId = this.__uniqId || {};
            return this.__uniqId[key]
                ? this.__uniqId[key]
                : (this.__uniqId[key] = `${key}${++uniqCount}`);
        }
    });
}
