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

function getEntity(key) {
    return entities[key] || (entities[key] = {
        cls : null,
        base : null,
        decls : null,
        modDecls : null,
        applyDecls : applyEntityDecls
    });
}

function applyEntityDecls() {
    var entity = this;

    if(entity.decls) {
        entity.decls.forEach(({ fields, staticFields}) => {
            entity.cls?
                inherit.self(entity.cls, fields, staticFields) :
                entity.cls = inherit(
                    entity.base? entity.base : BaseComponent,
                    fields,
                    staticFields);
        });

        entity.decls = null;
    }

    if(entity.modDecls) {
        const ptp = entity.cls.prototype;

        entity.modDecls.forEach(({ predicate, fields, staticFields }) => {
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

            inherit.self(entity.cls, fields, staticFields);
        });

        entity.modDecls = null;
    }

    return entity.cls;
}

export function decl(base, fields, staticFields) {
    if(typeof base !== 'function') {
        staticFields = fields;
        fields = base;
        base = undefined;
    }

    fixHooks(wrapBemFields(fields));

    const key = b(fields.block, fields.elem),
        entity = getEntity(key);

    if(base) {
        if(entity.base)
            throw new Error(`BEM-entity "${key}" has multiple ancestors`);
        entity.base = base;
    }

    (entity.decls || (entity.decls = [])).push({ fields, staticFields });

    return entity;
}

export function declMod(predicate, fields, staticFields) {
    fixHooks(wrapBemFields(fields));

    const entity = getEntity(b(fields.block, fields.elem));

    (entity.modDecls || (entity.modDecls = [])).push({ predicate, fields, staticFields });

    return entity;
}

export default Bem;
