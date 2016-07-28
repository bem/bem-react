import React, { Component } from 'react';
import inherit from 'inherit';
import { B } from 'b_'; // TODO: optimize?

const b = B({
    elementSeparator : '-',
    modSeparator : '_',
    modValueSeparator : '_'
});

function buildClassName(block, elem, mods, mixes, cls) {
    return b(block, elem, mods) +
        (mixes? ' ' + mixes.map(mix => b(mix.block || block, mix.elem, mix.mods)).join(' ') : '') +
        (cls? ' ' + cls : '');
}

function buildMixes(mix1, mix2) {
    if(!mix1 && !mix2) {
        return;
    }

    let mixes = [];

    mix1 && (mixes = [...mixes, ...mix1]);
    mix2 && (mixes = [...mixes, ...mix2]);

    return mixes;
}

function Bem({ block, elem, mods, tag : Tag = 'div', attrs, cls, children }) {
    const typeOfBlock = typeof block;
    if(typeOfBlock === 'object') {
        block = block.block;
    } else if(typeOfBlock === 'function') {
        block = block.prototype.block;
    }

    return (
        <Tag className={buildClassName(block, elem, mods, cls)} {...attrs}>
            {children}
        </Tag>
    );
}

const BaseComponent = inherit(Component, {
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
            Tag = this.tag(props),
            className = buildClassName(
                this.block,
                this.elem,
                this.mods(props),
                buildMixes(props.mix, this.mix(props)),
                this.cls(props));

        return (
            <Tag
                className={className}
                {...this.attrs(props)}
            >
                { this.content(props, props.children) }
            </Tag>
        );
    },

    content(_, children) {
        return children;
    }
}, {
    _applyModsDecls() {
        const ptp = this.prototype,
            key = b(ptp.block, ptp.elem),
            currentModsDecls = modsDecls[key];

        if(currentModsDecls) {
            currentModsDecls.forEach(({ predicate, fields, staticFields }) => {
                for(let name in fields) {
                    const field = fields[name];
                    typeof field === 'function' && (fields[name] = function() {
                        let method;
                        if(predicate.call(this, this.props)) {
                            method = field;
                        } else {
                            const baseMethod = ptp[name];
                            baseMethod && baseMethod !== field &&
                                (method = this.__base);
                        }

                        return method && method.apply(this, arguments);
                    });
                }

                inherit.self(this, fields, staticFields);
            });
            delete modsDecls[key];
        }
    }
});

function wrapWithFunction(obj, name) {
    if(Array.isArray(name)) {
        name.forEach(n => wrapWithFunction(obj, n));
    } else {
        if(obj.hasOwnProperty(name)) {
            const val = obj[name];
            typeof val !== 'function' && (obj[name] = () => val);
        }
    }

    return obj;
}

function wrapBemFields(obj) {
    return wrapWithFunction(obj, ['tag', 'attrs', 'content', 'mods', 'mix', 'cls']);
}

function fixHooks(obj) {
    for(let oldName in lifecycleHooks) {
        if(obj[oldName]) {
            obj[lifecycleHooks[oldName]] = obj[oldName];
            delete obj[oldName];
        }
    }

    return obj;
}

const entities = {},
    lifecycleHooks = {
        willMount : 'componentWillMount',
        didMount : 'componentDidMount',
        willReceiveProps : 'componentWillReceiveProps',
        shouldUpdate : 'shouldComponentUpdate',
        willUpdate : 'componentWillUpdate',
        didUpdate : 'componentDidUpdate',
        willUnmount : 'componentWillUnmount'
    };

export function decl(base, fields, staticFields) {
    if(typeof base !== 'function') {
        staticFields = fields;
        fields = base;
        base = undefined;
    }

    fixHooks(wrapBemFields(fields));

    const key = b(fields.block, fields.elem);

    return entities[key]?
        inherit.self(entities[key], fields, staticFields) :
        entities[key] = inherit(base || BaseComponent, fields, staticFields);
};

const modsDecls = {};

export function declMod(predicate, fields, staticFields) {
    fixHooks(wrapBemFields(fields));
    const key = b(fields.block, fields.elem);
    (modsDecls[key] || (modsDecls[key] = [])).push({ predicate, fields, staticFields });
};

export default Bem;
