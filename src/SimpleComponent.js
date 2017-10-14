import { Component } from 'preact';
import PropTypes from 'proptypes';
import inherit from 'inherit';
import Naming from './Naming';

export default function(overrideFields={}, overrideStaticFields={}) {
    const SimpleComponent = inherit([Component, Naming], {
        render({ addBemClassName = true, block, elem, mods, tag : Tag = 'div', mix, attrs, cls, children }) {

            if(!elem && !block && this.context.bemBlock) throw Error('Prop elem must be specified');

            const typeOfBlock = typeof block;
            if(typeOfBlock === 'undefined')
                block = this.context.bemBlock;
            /* istanbul ignore next */
            else if(typeOfBlock === 'object')
                block = block.block;
            /* istanbul ignore next */
            else if(typeOfBlock === 'function')
                block = block.prototype.block;

            if(!block) throw Error('Can\'t get block from context');

            return this.__render(addBemClassName, Tag, attrs, block, elem, mods, mix, cls, children);
        },

        getChildContext() {
            const { block, elem } = this.props,
                contextBlock = this.context.bemBlock;

            if(block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined')
                return { bemBlock : block };
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

    return inherit.self(SimpleComponent, overrideFields, overrideStaticFields);
}
