# Bem React Core

A library for developing user interfaces using the [BEM methodology](https://en.bem.info) in React.js. BEM React Core supports TypeScript and Flow type annotations.

* [Installation](#installation)
* [Quick Start](#quick-start)
  * [Hello, World](#hello-world)
* [Basics](#basics)
  * [Creating blocks](#creating-blocks)
  * [Creating elements](#creating-elements)
  * [Creating modifiers](#creating-modifiers)
  * [Creating additional HTML markup](#creating-additional-html-markup)
* [Working with CSS](#working-with-css)
  * [Generating CSS classes](#generating-css-classes)
* [API reference](#api-reference)
* [Migrating to API v2.0](#migrating-to-the-api-v20)
* [API versions](#api-versions)
* [Contribute](#contribute)
* [License](#license)

## Installation

Using [npm](https://www.npmjs.com):

```bash
npm init
npm install --save bem-react-core react react-dom
```

Using [Yarn](https://yarnpkg.com/en/):

```bash
yarn init
yarn add bem-react-core react react-dom
```

## Quick start

### Hello, World

This example shows how to create an application that will show the user a dialog box with the message "Hello, World!" when clicked.

A quick way to deploy a React project from scratch and start working with `bem-react-core` is by using the [BEM React Boilerplate](https://github.com/bem/bem-react-boilerplate) utility.

To create the "Hello, World!" app:

1. Install `bem-react-boilerplate`.

    ```bash
    git clone git@github.com:bem/bem-react-boilerplate.git my-app
    cd my-app/
    rm -rf .git
    git init
    npm install
    npm start
    ```

2. Edit the `src/index.tsx` file, replacing its contents with:

    ```tsx
    import * as React from 'react';
    import * as ReactDOM from 'react-dom';
    import { Block } from 'bem-react-core';

    class Button extends Block {
        block = 'Button';
        tag() {
            return 'button';
        }
        handleClick = () => {
            alert('Hello, World!');
        }
        attrs() {
            return {
                onClick: this.handleClick
            }
        }
    }

    ReactDOM.render(
        <Button>Click me</Button>,
        document.getElementById('root')
    );
    ```

3. Go to [localhost: 3000](http://localhost:3000/) to see the result.

The app is ready to go! To create more complex projects in `bem-react-core`, take a look at the [Basics](#basics) and the [API reference](#api-reference) sections.

## Basics

### Creating blocks

[A block](https://en.bem.info/methodology/quick-start/#block) is a functionally independent component of the user interface that can be reused. To create a block, you need to import the [Block](REFERENCE.md#block) class from the `bem-react-core` library. This is the base class for creating block instances.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

// Creating a Button block
class Button extends Block {
    block = 'Button';
    tag() {
        return 'button';
    }
}

ReactDOM.render(
    <Button>Click me</Button>,
    document.getElementById ('root')
);

```

Result:

```html
<button class='Button'>Click me</button>
```

### Creating elements

[An element](https://en.bem.info/methodology/quick-start/#element) is a part of a block that cannot be used without the block itself. To create an element, you need to import the [Elem](REFERENCE.md#elem) class from the `bem-react-core` library. This is the base class for creating element instances.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem } from 'bem-react-core';

interface IButtonProps {
    children: string;
}
// Creating the Text element
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
    tag() {
        return 'span';
    }
}
// Creating the Button block
class Button extends Block<IButtonProps> {
    block = 'Button';
    tag() {
        return 'button';
    }
    content() {
        return (
            <Text>{this.props.children}</Text>
        );
    }
}

ReactDOM.render(
    <Button>Click me</Button>,
    document.getElementById ('root')
);
```

Result:

```html
<button class='Button'>
    <span class='Button-Text'>Click me</span>
</button>
```

### Creating modifiers

[Modifiers](https://en.bem.info/methodology/quick-start/#modifier) define the appearance, state, or behavior of a block or element. To modify a block or element, use the [HOC](https://reactjs.org/docs/higher-order-components.html) function [withMods()](REFERENCE.md#withmods) from the `bem-react-core` library. The `withMods()` function gets a base block or element with a list of its modifiers as arguments, and returns a modified block or element.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem, withMods } from 'bem-react-core';

interface IButtonProps {
    children: string;
}
interface IModsProps extends IButtonProps {
    type: 'link' | 'button';
}
// Creating the Text element
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
    tag() {
        return 'span';
    }
}
// Creating the Button block
class Button<T extends IModsProps> extends Block<T> {
    block = 'Button';
    tag() {
        return 'button';
    }
    mods() {
        return {
            type: this.props.type
        };
    }
    content() {
        return (
            <Text>{this.props.children}</Text>
        );
    }
}
// Extending functionality of the Button block when the "type" property is set to the value "link"
function ButtonLink() {
    return class ButtonLink extends Button<IModsProps> {
        static mod = ({ type }: any) => type === 'link';
        tag() {
            return 'a';
        }
        mods() {
            return {
                type: this.props.type
            };
        }
        attrs() {
            return { 
                href: 'www.yandex.ru' 
            };
        }
    }
}
// Combining the Button and ButtonLink classes
const ButtonView = withMods(Button, ButtonLink);

ReactDOM.render(
    <React.Fragment>
        <ButtonView type='button'>Click me</ButtonView>
        <ButtonView type='link'>Click me</ButtonView>
    </React.Fragment>,
    document.getElementById('root')
);
```

Result:

```html
<button type='button' class='Button Button_type_button'>
    <span class='Button-Text'>Click me</span>
</button>
<a type='link' href='www.yandex.ru' class='Button Button_type_link'>
    <span class='Button-Text'>Click me</span>
</a>
```

### Creating additional HTML markup

To create an additional HTML element with the name of the CSS class formed using the BEM methodology, you need to import the [Bem](REFERENCE.md#bem) helper from the `bem-react-core` library.

> **Note:** Learn more about [generating CSS classes](#generating-css-classes).

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bem } from 'bem-react-core';

ReactDOM.render(
    <React.Fragment>
        <Bem block='MyBlock' />
        <Bem block='MyBlock' elem='Inner' />
        <Bem block='MyBlock' tag='span' />
        <Bem block='MyBlock' mods={{theme: 'default'}} />
    </React.Fragment>,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock'></div>
<div class='MyBlock-Inner'></div>
<span class='MyBlock'></span>
<div class='MyBlock MyBlock_theme_default'></div>
```

## Working with CSS

### Generating CSS classes

Classes are generated using the fields [block](REFERENCE.md#block), [elem](REFERENCE.md#elem) and method [mods()](REFERENCE.md#mods) in accordance with the [React naming scheme](https://en.bem.info/methodology/naming-convention/#react-style) for CSS classes that is shown below. Separators of block, element, and modifier names are generated automatically.

React scheme for forming CSS class names:

`BlockName-ElemName_modName_modVal`

> **Note:** Learn more about [CSS class naming schemes](https://en.bem.info/methodology/naming-convention/).

Example:

```tsx
// Creating a block
class Button extends Block {
    block = 'Button';
}

// Creating an element
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
}

// Creating a block modifier
class Button extends Block {
    block = 'Button';
    mods() {
        return {
            theme: 'default'     
        }
    }
}

// Creating an element modifier
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
    elemMods() {
        return {
            theme: 'default'     
        }
    }
}
```

Result:

```html
<!-- Block -->
<div class='Button'></div>

<!-- Element -->
<div class='Button-Text'></div>

<!-- Block modifier -->
<div class= 'Button Button_theme_default'></div>

<!-- Element modifier -->
<div class= 'Button-Text Button-Text_theme_default'></div>
```

## API reference

For more information about the API, see: [REFERENCE.md](REFERENCE.md).

## Migrating to the API v2.0

For detailed instructions on switching to v2.0 of the API, see: [MIGRATION.md](MIGRATION.md).

## API versions

The API is versioned according to [Semantic Versioning](https://semver.org). We recommend using the latest stable version of the library.

> **Note:** The history of API edits can be found in [CHANGELOG.md](CHANGELOG.md). To learn about switching between different versions of the API, see: [MIGRATION.md](MIGRATION.md).

## Contribute

Bem React Core is an open source library that is under active development and is also used within [Yandex](https://yandex.com/company/).

If you have suggestions for improving the API, you can send us a [Pull Request](https://github.com/bem/bem-react-core/pulls).

If you found a bug, you can create an [issue](https://github.com/bem/bem-react-core/issues) describing the problem.

For a detailed guide to making suggestions, see: [CONTRIBUTING.md](CONTRIBUTING.md).

## License

© 2018 [Yandex](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).
