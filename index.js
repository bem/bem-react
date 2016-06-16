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
}

BEM.decl = (fields, staticFields) => {
    wrapWithFunction(fields, ['tag', 'attrs', 'content', 'mods']);

    return inherit(BaseComponent, fields, staticFields);
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
    attrs : { href : '//yandex.ru' }
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
            <OtherBlock
                key="3"
                value={this.state.value}
                onChange={({ target }) => this.setState({ value : target.value }) }/>
        ];
    }
});

// index.js

ReactDom.render(<Root/>, document.getElementById('root'));
