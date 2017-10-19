import React, { Component } from 'react';
import inherit from 'inherit';
import PropTypes from 'prop-types';
import CNB from './ClassNameBuilder';

export default inherit(Component, {
    __constructor() {
        this.__base(...arguments);
        this.__cnb || (this.__cnb = this.__self.cnb());
    },

    __render(node) {
        return React.createElement(node.tag || 'div', {
            className : this.__cnb.str(node),
            ...node.attrs
        }, node.children);
    },

    getChildContext() {
        const block = this.block || this.props.block,
            elem = this.elem || this.props.elem,
            contextBlock = this.context.bemBlock;

        if(block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined')
            return { bemBlock : block };
    }
}, {
    __dangerouslySetNaming : 'react',

    cnb() {
        return new CNB(this.__dangerouslySetNaming);
    },

    displayName(block, elem) {
        this.__cnb || (this.__cnb = this.cnb());
        return this.__cnb.str({ addBemClassName : true, block, elem });
    },

    childContextTypes : {
        bemBlock : PropTypes.string
    },

    contextTypes : {
        bemBlock : PropTypes.string
    }
});
