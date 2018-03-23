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
        wrap : (props, state, component) => component,

        render() {
            const { props, state } = this,
                attrs = this.attrs(props, state) || {},
                style = this.style(props, state) || {},
                component = this.__render({
                    addBemClassName : this.addBemClassName(props, state),
                    tag : this.tag(props, state),
                    attrs : { ...attrs, style : { ...attrs.style, ...style } },
                    block : this.block,
                    elem : this.elem,
                    mods : this.mods(props, state),
                    mix : [].concat(this.mix(props, state), this.addMix(props, state)),
                    cls : this.cls(props, state),
                    children : this.content(props, state)
                }),
                optionalyReplaced = this.replace
                    ? this.replace(props, state) || component
                    : component,
                optionalyWrapped = this.wrap(props, state, optionalyReplaced);

            return optionalyWrapped;
        },

        generateId(key = 'uniq') {
            this.__uniqId = this.__uniqId || {};
            return this.__uniqId[key]
                ? this.__uniqId[key]
                : (this.__uniqId[key] = `${key}${++uniqCount}`);
        }
    });
}
