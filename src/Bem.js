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
    },

    render() {
        let node = Object.assign({}, this.props);
        const { bemBlock } = this.context;

        if(!node.elem && !node.block && bemBlock) throw Error('Prop elem must be specified');

        const typeOfBlock = typeof node.block;
        if(typeOfBlock === 'undefined')
            node.block = bemBlock;
        /* istanbul ignore next */
        else if(typeOfBlock === 'object')
            node.block = block.block;
        /* istanbul ignore next */
        else if(typeOfBlock === 'function')
            node.block = block.prototype.block;

        if(!node.block) throw Error('Can\'t get block from context');

        return this.__render(node);
    }
}, {
    displayName : 'Bem',

    cnb() {
        return new CNB(this.__dangerouslySetNaming);
    },

    childContextTypes : {
        bemBlock : PropTypes.string
    },

    contextTypes : {
        bemBlock : PropTypes.string
    },

    __dangerouslySetNaming : 'react',

    __displayName(block, elem) {
        this.__cnb || (this.__cnb = this.cnb());
        return this.__cnb.str({ addBemClassName : true, block, elem });
    }
});
