import { Component } from 'react';
import PropTypes from 'prop-types';
import inherit from 'inherit';
import renderTag from './renderTag';

export default function(classNameBuilder) {
    const __render = renderTag(classNameBuilder);
    return inherit(Component, {
        render() {
            let {
                addBemClassName = true,
                block,
                elem,
                mods,
                tag : Tag = 'div',
                mix,
                attrs,
                cls,
                children
            } = this.props;

            const typeOfBlock = typeof block;
            if(typeOfBlock === 'undefined')
                block = this.context.bemBlock;
            else if(typeOfBlock === 'object')
                block = block.block;
            else if(typeOfBlock === 'function')
                block = block.prototype.block;


            return __render(addBemClassName, Tag, attrs, block, elem, mods, mix, cls, children);
        },
        getChildContext() {
            const { block, elem } = this.props;
            if(block && !elem) return { bemBlock : block };
        }
    }, {
        displayName : 'Bem',

        childContextTypes : {
            bemBlock : PropTypes.string
        },

        contextTypes : {
            bemBlock : PropTypes.string
        }
    });
}
