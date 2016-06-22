// BEM.js

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import inherit from 'inherit';
import b from 'b_'; // TODO: optimize

function BEM() {

}

var BaseComponent = inherit(Component, {
    __constructor() {
        this.__base.apply(this, arguments);
        this.onInit(this.props);
    },

    onInit() {},

    tag() {
        return 'div';
    },

    attrs() {
        return null;
    },

    mods() {
        return null;
    },

    _buildClassName() {
        return b(this.block, this.elem, this.mods(this.props));
    },

    render() {
        var Tag = this.tag(this.props);
        return (
            <Tag className={this._buildClassName()} {...this.attrs(this.props)}>
                { this.content(this.props, this.props.children) }
            </Tag>
        );
    },

    content(_, children) {
        return children;
    }
}, {
    declMod(predicate, fields, staticFields) {
        wrapBemFields(fields);
        var basePtp = this.prototype;
        for(let name in fields) {
            var field = fields[name];
            typeof field === 'function' && (fields[name] = function() {
                var method;
                if(predicate.call(this, this.props)) {
                    method = field;
                } else {
                    var baseMethod = basePtp[name];
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
            var val = obj[name];
            typeof val !== 'function' && (obj[name] = () => val);
        }
    }

    return obj;
}

function wrapBemFields(obj) {
    return wrapWithFunction(obj, ['tag', 'attrs', 'content', 'mods']);
}

var entities = {};

BEM.decl = (base, fields, staticFields) => {
    if(typeof base !== 'function') {
        staticFields = fields;
        fields = base;
        base = undefined;
    }

    wrapBemFields(fields);
    var key = b(fields.block, fields.elem);

    return entities[key]?
        inherit.self(entities[key], fields, staticFields) :
        entities[key] = inherit(base || BaseComponent, fields, staticFields);
};


// MyBlock.js

var MyBlock = BEM.decl({
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
    }
});

// other-level/MyBlock.js

var MyBlock = BEM.decl({
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
    }
});

// OtherBlock.js

var OtherBlock = BEM.decl({
    block : 'OtherBlock',
    tag : 'input',
    attrs({ value, onChange }) {
        return {
            value,
            onChange
        };
    }
});

// MyBlock_myMod.js

var MyDerivedBlock = BEM.decl(MyBlock, {
    block : 'MyDerivedBlock',
    onClick(e) {
        this.__base.apply(this, arguments);
        console.log(this.block);
    }
});

// Root.js

var Root = BEM.decl({
    block : 'Root',
    onInit() {
        this.state = { value : '567' };
    },
    content() {
        return [
            <MyBlock key="1"/>,
            <MyBlock key="2" disabled>321</MyBlock>,
            ' ',
            <MyBlock key="3" myMod>myMod</MyBlock>,
            ' ',
            <MyDerivedBlock key="4">MyDerivedBlock</MyDerivedBlock>,
            <OtherBlock
                key="5"
                value={this.state.value}
                onChange={({ target }) => this.setState({ value : target.value }) }/>
        ];
    }
});

// index.js

ReactDom.render(<Root/>, document.getElementById('root'));
