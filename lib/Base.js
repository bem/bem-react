import React, { Component } from 'react';
import inherit from 'inherit';

export default inherit(Component, {
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
            Bem = this.Bem;

        return (
            <Bem
                tag={this.tag(props)}
                block={this.block}
                elem={this.elem}
                mods={this.mods(props)}
                mix={this.classBuilder.mixes(props.mix, this.mix(props))}
                cls={this.cls(props)}
                attrs={this.attrs(props)}
            >
                { this.content(props, props.children) }
            </Bem>
        );
    },

    content(_, children) {
        return children;
    }
});
