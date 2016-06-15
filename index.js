// BEM.js

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import inherit from 'inherit';

function BEM() {

}

var BaseComponent = inherit(Component, {
    tag() {
        return 'div';
    },

    render() {
        var Tag = this.tag(this.props);
        return <Tag>{ this.content(this.props, this.props.children) }</Tag>;
    },

    content(_, children) {
        return children;
    }
});

function wrapWithFunction(obj, name) {
    if(obj.hasOwnProperty(name)) {
        var val = obj[name];
        typeof val !== 'function' && (obj[name] = () => val);
    }
}

BEM.decl = (fields, staticFields) => {
    wrapWithFunction(fields, 'tag');
    wrapWithFunction(fields, 'content');

    return inherit(BaseComponent, fields, staticFields);
};


// MyBlock.js

var MyBlock = BEM.decl({
    block : 'MyBlock',
    tag : 'a'
});

// index.js

ReactDom.render(
    <div>
        <MyBlock/>
        <MyBlock>321</MyBlock>
    </div>,
    document.getElementById('root'));
