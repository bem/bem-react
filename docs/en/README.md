# BEM React Core [![Build Status](https://travis-ci.org/bem/bem-react-core.svg?branch=master)](https://travis-ci.org/bem/bem-react-core) [![GitHub Release](https://img.shields.io/github/release/bem/bem-react-core.svg)](https://github.com/bem/bem-react-core/releases) [![devDependency Status](https://david-dm.org/bem/bem-react-core/dev-status.svg)](https://david-dm.org/bem/bem-react-core#info=devDependencies)

## What is it?

The BEM React Core is a library for working with React components according to the [BEM methodology](https://en.bem.info/methodology/key-concepts/).
The library runs on top of the regular React components and provides an [API](./REFERENCE.md) for defining declarations of [blocks](https://en.bem.info/methodology/key-concepts/#block), [elements](https://en.bem.info/methodology/key-concepts/#element), and [modifiers](https://en.bem.info/methodology/key-concepts/#modifier). Blocks and elements created with bem-react-core are fully compatible with standard React components and can be used in the same project.

## Why?

**If you are familiar with the [BEM methodology](https://en.bem.info/methodology/)** and want to get the functionality of the [i-bem.js](https://en.bem.info/platform/i-bem/) framework and a template engine in a single lightweight library.

**If you are using React** and want to take advantage of the BEM methodology: [redefinition levels](https://en.bem.info/methodology/redefinition-levels/), [mixes](https://en.bem.info/methodology/key-concepts/#mix), and the class naming scheme for [CSS](https://en.bem.info/methodology/naming-convention/#react-style).

> To explain [why you need bem-react-core](./Introduction/Motivation.md), we have described the types of tasks that a combination of BEM and React can handle more efficiently than other existing methods.

## Library features

The library extends the capabilities of the classic React approach and allows you to:

* [Generate CSS classes](#generating-css-classes)
* [Redefine components by using modifiers](#redefining-components-declaratively-using-modifiers)
* [Use redefinition levels](#using-redefinition-levels)

Examples are compared with the classic code for React components.

### Generating CSS classes

A declarative description of a component reduces syntactic noise.

#### React.js

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

#### BEM React Core

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

### Redefining components declaratively using modifiers

To modify a React component, you have to add conditions to the core code of this component. As the modifications grow, the conditions multiply and become more complex. In order to avoid complex code conditions, either inherited classes or [High Order Components](https://reactjs.org/docs/higher-order-components.html) are used. Both methods have their own [limitations](./Introduction/Motivation.md#code-reuse).

In bem-react-core, the states and appearance of universal components are changed with [modifiers](https://en.bem.info/methodology/key-concepts/#modifier). The functionality of modifiers is declared in separate files. An unlimited number of modifiers can be set per component. To add a modifier, specify its name and value in the component declaration.

Redefining a component declaratively by using modifiers allows you to:

* Avoid chains of conditions with `if` or `switch` in the `render()` method, which prevent you from flexibly changing the component.
* Include only the necessary modifiers in the build.
* Create an unlimited number of modifiers without overloading the core code of the component.
* Combine multiple modifiers in a single component for each specific case.

#### React.js

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

#### BEM React Core

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

> The [Inherit](https://github.com/dfilatov/inherit) library is used for creating declarations. Unlike classes from ES2015, it allows you to create a dynamic definition of a class and modify it. It also provides the ability to make a "super" call (`this.__base(...arguments)`) without explicitly specifying the method name (`super.content(...arguments)`).

### Using redefinition levels

[Redefinition levels](https://en.bem.info/methodology/key-concepts/#redefinition-level) are used in BEM for dividing and reusing code.

The bem-react-core library allows you to declare React components on different redefinition levels.

> [Examples of using redefinition levels](https://en.bem.info/methodology/redefinition-levels/#examples-using-redefinition-levels)

The example below looks at a case when the code is divided by platform. Part of the code describes general functionality (`common.blocks`) and part of it is platform-specific (`desktop.blocks` and `touch.blocks`):

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

// touch.blocks/Button/Button.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'Button',
    willInit() {
        this.state = {};
        this.onPointerpress = this.onPointerpress.bind(this);
        this.onPointerrelease = this.onPointerrelease.bind(this);
    },
    mods() {
        return { pressed : this.state.pressed };
    },
    attrs({ type }) {
        return {
            ...this.__base(...arguments),
            onPointerpress : this.onPointerpress,
            onPointerrelease : this.onPointerrelease
        };
    },
    onPointerpress() {
        this.setState({ pressed : true });
    },
    onPointerrelease() {
        this.setState({ pressed : false });
    }
});
```

Dividing the code into separate redefinition levels allows you to configure the build so that the component functionality from `desktop.blocks` is only in the desktop browser build (`common.blocks + desktop.blocks`) and is not included in the build for mobile devices (`common.blocks + touch.blocks`).

## Usage

There are different ways to use the bem-react-core library:

* The library is available as a [package in npm or Yarn](#installation).
* Pre-compiled library files can be [connected to a CDN](#cdn).

### Installation

Using [npm](https://www.npmjs.com):

```
npm i -S bem-react-core
```

Using [Yarn](https://yarnpkg.com/en/):

```
yarn add bem-react-core
```

### CDN

Copy the links to the pre-compiled library files to the HTML pages:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/bem-react-core@1.0.0-rc.8/umd/react.js"></script>
```

> [Connect BEM React Core using CDN links](./Tutorial/UseCDNLinks.md)

### Build

#### webpack

Use the [loader](https://github.com/bem/webpack-bem-loader) for the webpack.

```
npm i -D webpack-bem-loader babel-core
```

**webpack.config.js**

```js
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
    techs : ['js', 'css'], // Technologies used for implementing components
    levels : [            // Levels used in the project
        `${__dirname}/common.blocks`,
        `${__dirname}/desktop.blocks`,
        // ...
    ]
}
// ...
```

#### Babel

Use the [plugin](https://github.com/bem/babel-plugin-bem-import) for Babel.

```
npm i -D babel-plugin-bem-import
```

**.babelrc**

```json
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

Getting sources:

```
git clone git://github.com/bem/bem-react-core.git
cd bem-react-core
```

Installing dependencies:

```
npm i
```

Reviewing code:

```
npm run lint
```

Running tests:

```
npm test
```

> [How to make changes to a project](../../CONTRIBUTING.md)

## License

© 2018 YANDEX LLC. The code is licensed under the Mozilla Public License 2.0.
