// Bem.js

import React, { Component } from 'react';
import ReactDom from 'react-dom';
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
    declMod(predicate, fields, staticFields) {
        wrapBemFields(fields);
        fixHooks(fields);

        const basePtp = this.prototype;
        for(let name in fields) {
            const field = fields[name];
            typeof field === 'function' && (fields[name] = function() {
                let method;
                if(predicate.call(this, this.props)) {
                    method = field;
                } else {
                    const baseMethod = basePtp[name];
                    baseMethod && baseMethod !== field &&
                        (method = this.__base);
                }

                return method && method.apply(this, arguments);
            });
        }

        inherit.self(this, fields, staticFields);

        return this;
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

Bem.decl = (base, fields, staticFields) => {
    if(typeof base !== 'function') {
        staticFields = fields;
        fields = base;
        base = undefined;
    }

    wrapBemFields(fields);
    fixHooks(fields);

    const key = b(fields.block, fields.elem);

    return entities[key]?
        inherit.self(entities[key], fields, staticFields) :
        entities[key] = inherit(base || BaseComponent, fields, staticFields);
};


// MyBlock.js

const MyBlock = Bem.decl({
    block : 'MyBlock',
    mods({ disabled }) {
        return {
            disabled,
            a : true,
            b : 1
        };
    },
    tag : 'a',
    attrs() {
        return {
            href : '//yandex.ru',
            onClick : this.onClick.bind(this)
        }
    },
    onClick(e) {
        e.preventDefault();
        console.log('without myMod');
    },
    didMount() {
        console.log(`${this.block} is mounted`);
    }
});

// other-level/MyBlock.js

Bem.decl({
    block : 'MyBlock',
    onClick(e) {
        this.__base.apply(this, arguments);
        console.log('other-level');
    }
});

// MyBlock_myMod.js

MyBlock.declMod(({ myMod }) => myMod, {
    onClick() {
        this.__base.apply(this, arguments);
        console.log('with myMod');
    },
    didMount() {
        this.__base();
        console.log(`${this.block} with myMod is mounted`);
    }
});

// OtherBlock.js

const OtherBlock = Bem.decl({
    block : 'OtherBlock',
    tag : 'input',
    mix : [{ block : 'YetAnotherBlock' }, { elem : 'elem' }],
    attrs({ value, onChange }) {
        return {
            value,
            onChange
        };
    }
});

// MyBlock_myMod.js

const MyDerivedBlock = Bem.decl(MyBlock, {
    block : 'MyDerivedBlock',
    cls : 'add-cls',
    onClick(e) {
        this.__base.apply(this, arguments);
        console.log(this.block);
    }
});

// Root.js

const Root = Bem.decl({
    block : 'Root',
    willInit() {
        this.state = { value : '567' };
    },
    content() {
        return [
            <MyBlock key="1">
                <Bem block="InlineBlock" elem="Elem" mods={{ a : 'b' }}>InlineBlock</Bem>
            </MyBlock>,
            <MyBlock key="2" disabled>321</MyBlock>,
            ' ',
            <MyBlock key="3" myMod>myMod</MyBlock>,
            ' ',
            <MyDerivedBlock key="4">MyDerivedBlock</MyDerivedBlock>,
            <OtherBlock
                key="5"
                value={this.state.value}
                mix={{ block : 'OuterMixedBlock', elem : 'Elem' }}
                onChange={({ target }) => this.setState({ value : target.value }) }/>,
            <Bem block={this} elem="MyElem" key="6" mods={{ a : 'b' }}>123</Bem>,
            <Bem block={this.__self} elem="OtherElem" key="8"/>,
            <Bem block="OtherBlock" elem="OtherElem" key="9"/>,
        ];
    }
});

// index.js

ReactDom.render(<Root/>, document.getElementById('root'));
