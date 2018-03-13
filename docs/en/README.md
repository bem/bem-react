# BEM React Core [![Build Status](https://travis-ci.org/bem/bem-react-core.svg?branch=master)](https://travis-ci.org/bem/bem-react-core) [![GitHub Release](https://img.shields.io/github/release/bem/bem-react-core.svg)](https://github.com/bem/bem-react-core/releases) [![devDependency Status](https://david-dm.org/bem/bem-react-core/dev-status.svg)](https://david-dm.org/bem/bem-react-core#info=devDependencies)

## What is this?

It is a library for declaration React components as BEM entities.
It works on top of usual React-components and provides API for declaration of blocks, elements and their modifiers. Blocks and elements created with this library are fully compatible with any React components: blocks and elements can use any other React components inside and can be used inside other React components.

## Why?

__If you already use [i-bem.js](https://en.bem.info/platform/i-bem/)__
and you want to get benefits from React approach and not to lose usual BEM terms and declarative style.

__If you already use React__ and you want to get benefits from [BEM methodology](https://en.bem.info/methodology/).


### CSS classes generation

Your code will look better without unnecessary syntax noise.

#### Before

```jsx
import React from 'react';

export default class Button extends React.Component {
    render() {
        const { size, theme, children } = this.props;
        return (
            <button className={`Button Button_size_${size} Button_theme_${theme}`}>
                {children}
            </button>
        );
    }
};
```

#### After

```jsx
import { decl } from 'bem-react-core';

export default decl({
    block : 'Button',
    tag: 'button',
    mods({ size, theme }) {
        return { size, theme };
    }
});
```

__NB__ You can use other libraries for CSS classes generation:
  * [b_](https://github.com/azproduction/b_)
  * [bem-cn](https://github.com/albburtsev/bem-cn)
  * [react-bem](https://github.com/cuzzo/react-bem)
  * [bem-classnames](https://github.com/pocotan001/bem-classnames)
  * [react-bem-helper](https://github.com/marcohamersma/react-bem-helper)
  * [dumb-bem](https://github.com/agudulin/dumb-bem)

## Declarative modifiers definition

[Modifier](https://en.bem.info/methodology/key-concepts/#modifier) is the one of key-concept of BEM methodology. Modifiers are supposed to help you make variations of the same component. `bem-react-core` enables you to declare additional behaviour for modifiers easily ([see more in documentation](REFERENCE.md#declmodpredicate-prototypeprops--staticprops)).

#### Before

```jsx
import React from 'react';

export default class Button extends React.Component {
    render() {
        const { size, theme, children } = this.props;
        let className = 'Button',
            content = [children];

        if(size === 'large') {
            className += `Button_size_${size}`;
            content.unshift('Modification for size with value \'large\'.');
        }

        if(theme === 'primary') {
            className += `Button_theme_${theme}`;
            content.unshift('Modification for theme with value \'primary\'.');
        }

        return (
            <button className={className}>
                {content}
            </button>
        );
    }
};
```

Usually declaration of additional behaviour requires extra conditions in main code.
As a different way you could use inheritance, but it's awkward to compose many modifiers of one component
at the same time.

#### After

```jsx
// Button.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'Button',
    tag: 'button',
    mods({ size, theme }) {
        return { size, theme };
    }
});

// Button_size_large.js

import { declMod } from 'bem-react-core';

export default declMod({ size : 'large' }, {
    block : 'Button',
    content() {
        return [
            'Modification for size with value \'large\'.',
            this.__base(...arguments)
        ];
    }
});

// Button_theme_primary.js

import { declMod } from 'bem-react-core';

export default declMod({ theme : 'primary' }, {
    block : 'Button',
    content() {
        return [
            'Modification for theme with value \'primary\'.',
            this.__base(...arguments)
        ];
    }
});
```

__NB__ `bem-react-core` uses [Inherit](https://github.com/dfilatov/inherit) library for declaration. Unlike ES2015 classes it adds ability to dynamically create and modify JS class. It also helps to make super-call (`this.__base(...arguments)`) without specifying method name (`super.content(...arguments)`).

## Redefinition levels

[Redefinition levels](https://en.bem.info/methodology/key-concepts/#redefinition-level) it's a part of BEM methodology which helps you to separate and reuse your code. For example you can separate your code by platforms. `bem-react-core` helps to declare React components on the different levels.

```jsx
// common.blocks/Button/Button.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'Button',
    tag : 'button',
    attrs({ type }) {
        return { type };
    }
});

// desktop.blocks/Button/Button.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'Button',
    willInit() {
        this.state = {};
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    },
    mods() {
        return { hovered : this.state.hovered };
    }
    attrs({ type }) {
        return {
            ...this.__base(...arguments),
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

## Blocks and elements without declaration

For comfortable usage BEM blocks and elements without declaration of JS class you can use `Bem` helper in JSX.

#### Before
```jsx
import React from 'react';

export default ({ size, theme, tabIndex }) => (
    <button className={`Button Button_size_${size} Button_theme_${theme}`} tabIndex={tabIndex}>
        <span className="Button-Text">Go!</span>
    </button>
);
```

#### After
```jsx
import { Bem } from 'bem-react-core';

export default ({ size, theme }) => (
    <Bem block="Button" mods={{ size, theme }} tag="button" tabIndex={tabIndex}>
        <Bem elem="Text">Go!</Bem>
    </Bem>
);
```

## How to use?

### Installation

```
npm i -S bem-react-core
```

```
yarn add bem-react-core
```

### CDN

``` html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/prop-types/prop-types.min.js"></script>
<script src="https://unpkg.com/bem-react-core@1.0.0-rc.8/umd/react.js"></script>
```

### Build

#### webpack

Using [loader](https://github.com/bem/webpack-bem-loader) for webpack.

```
npm i -D webpack-bem-loader babel-core
```

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

## Development

Get sources:

```
git clone git://github.com/bem/bem-react-core.git
cd bem-react-core
```

Install dependencies:

```
npm i
```

Code linting:

```
npm run lint
```

Run test:

```
npm test
```

## License

Code and documentation copyright 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
