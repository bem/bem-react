# BEM React Core

## What is this?

It is a library for declaration React components as BEM entities. 
It works on top of usual React-components and provides API for declaration of blocks, elements and their modifiers. 
Blocks and elements created with this library are fully compatible with any React components:
blocks and elements can use any other React components inside and can be used inside other React components.

## Why?

__If you already use [i-bem.js](https://en.bem.info/platform/i-bem/)__
and you want to get benefits from React approach and not to lose usual BEM terms and declarative style.

__If you already use React__ and you want to get benefits from [BEM methodology](https://en.bem.info/methodology/).


### CSS classes generation

Your code will look better without unnecessary syntax noise.

#### Before

```jsx
import React from 'react';

export default class MyBlock extends React.Component {
    render() {
        const { myMod1, myMod2, children } = this.props;
        return (
            <div className={`MyBlock MyBlock_myMod1_${myMod1} MyBlock_myMod2_${myMod2}`}>
                {children}
            </div>
        );
    }
};
```

#### Afrer

```jsx
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mods({ myMod1, myMod2 }) {
        return { myMod1, myMod2 };
    }
});
```

__NB__ You can use other libraries for CSS classes generation:
  * [b_](https://github.com/azproduction/b_)
  * [bem-cn](https://github.com/albburtsev/bem-cn)
  * [react-bem](https://github.com/cuzzo/react-bem)
  * [bem-classnames](https://github.com/pocotan001/bem-classnames)
  * [react-bem-helper](https://github.com/marcohamersma/react-bem-helper)

## Declarative modifiers definition

[Modifier](https://en.bem.info/methodology/key-concepts/#modifier) is the one of key-concept of BEM methodology. 
Modifiers are supposed to help you make variations of the same component.
`bem-react-core` enables you to declare additional behaviour for modifiers easily ([see more in documentation](REFERENCE.md)).

#### Before

```jsx
import React from 'react';

export default class MyBlock extends React.Component {
    render() {
        const { myMod1, myMod2, children } = this.props;
        let className = 'MyBlock',
            content = [children];
        
        if(myMod1 === 'myVal1') {
            className += `MyBlock_myMod1_${myMod1}`;
            content.unshift('Modification for myMod1 with value myVal1.');
        }
        
        if(myMod2 === 'myVal2') {
            className += `MyBlock_myMod1_${myMod2}`;
            content.unshift('Modification for myMod2 with value myVal2.');
        }
        
        return (
            <div className={className}>
                {content}
            </div>
        );
    }
};
```

Usually declaration of additional behaviour requires extra conditions in main code.
As a different way you could use inheritance, but it's awkward to compose many modifiers of one component
at the same time.

#### Before

```jsx
// MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mods({ myMod1, myMod2 }) {
        return { myMod1, myMod2 };
    }
});

// MyBlock_myMod1_myVal1.js

import { declMod } from 'bem-react-core';

export default declMod(({ myMod1 }) => myMod1 === 'myVal1', {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod1 with value myVal1.',
            this.__base.apply(this, arguments)
        ];
    }
});

// MyBlock_myMod2_myVal2.js

import { declMod } from 'bem-react-core';

export default declMod(({ myMod2 }) => myMod2 === 'myVal2', {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod2 with value myVal2.',
            this.__base.apply(this, arguments)
        ];
    }
});
```

__NB__ `bem-react-core` uses [Inherit](https://github.com/dfilatov/inherit) library for JS classes declaration. It helps
to make super-call (`this.__base.apply(this, arguments)`) without method name (`super.content.apply(this, arguments)`).

## Redefinition levels

[Redefinition levels](https://en.bem.info/methodology/key-concepts/#redefinition-level) it's a part of BEM 
methodology which helps you to separate and reuse your code. For example you can separate your code by platforms.
`bem-react-core` helps to declare React components on the different levels ([see more in documentation](REFERENCE.md)).

```jsx
// common.blocks/MyBlock/MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    tag : 'a',
    attrs({ url }) {
        return { href : url };
    }
});

// decktop.blocks/MyBlock/MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    willInit() {
        this.state = {};
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    },
    mods() {
        return { hovered : this.state.hovered };
    }
    attrs({ url }) {
        return {
            ...this.__base.apply(this, arguments),
            onMouseEnter : this.onMouseEnter,
            onMouseLeave : this.onMouseLeave
        };
    },
    onMouseEnter() {
        this.setState({ hovered : true });
    },
    onMouseLeave() {
        this.setState({ hovered : false });
    }
});
```

Due to this you can configure build process for bundles split by platforms.
Files from `desktop.blocks` are going to `common.blocks + desktop.blocks`
for desktop browsers and not to `common.blocks + touch.blocks` for mobile.

## How to use?

### Installation

> npm i -S bem-react-core

> yarn add bem-react-core

### Build

#### webpack

Using [loader](https://github.com/bem/webpack-bem-loader) for webpack.

> npm i -D webpack-bem-loader babel-core

__webpack.config.js__
``` js
// ...
module : {
    loaders : [
        {
            test : /\.js$/,
            exclude : /node_modules/,
            loaders : ['webpack-bem', 'babel']
        },
        // ...
    ],
    // ...
},
bemLoader : {
    techs : ['js', 'css'], 
    levels : [
        `${__dirname}/common.blocks`,
        `${__dirname}/desktop.blocks`,
        // ...
    ]
}
// ...
```

#### Babel

Using [plugin](https://github.com/bem/babel-plugin-bem-import) for Babel.

> npm i -D babel-plugin-bem-import

__.babelrc__
``` json
{
  "plugins" : [
    ["bem-import", {
      "levels" : [
        "./common.blocks",
        "./desktop.blocks"
      ],
      "techs" : ["js", "css"]
    }]
  ]
}
```

## License

Code and documentation copyright 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
