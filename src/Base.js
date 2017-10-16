import { Component } from 'react';
import inherit from 'inherit';
import PropTypes from 'prop-types';

import renderTag from './renderTag';
import CNB from './ClassNameBuilder';

export default inherit(Component, {
    __constructor() {
        this.__base(...arguments);
        this.__cnb || (this.__cnb = this.__self.cnb());
        this.__render = renderTag(this.__cnb);
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

    displayName({ block, elem }) {
        this.__cnb || (this.__cnb = this.cnb());
        return this.__cnb.str({ bem : true, block, elem });
    },

    childContextTypes : {
        bemBlock : PropTypes.string
    },

    contextTypes : {
        bemBlock : PropTypes.string
    }
});
