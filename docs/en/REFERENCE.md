# API Reference

> **Note:** This reference guide describes the `bem-react-core` API version 2.0.0 programming interface. This version of the API supports TypeScript and Flow annotation.

* [API](#api)
    * [Block](#block)
    * [Elem](#elem)
    * [withMods()](#withmods)
    * [Bem](#bem)
* [Class methods](#class-methods)
    * [Block](#block-1)
    * [Elem](#elem-1)
* [External API](#external-api)
    * [className](#classname)
    * [Bem helper properties](#bem-helper-properties)

## API

### Block

```tsx
class ... extends Block<IProps, IState> {
    ...
}
```

Base class for creating blocks. Blocks divide the user interface into independent, reusable parts.

> **Note:** For more information about methods for manipulating blocks, see: [Class methods](#class-methods).

#### Class fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `block` (required) | `string` | Block name. Defines the CSS block class. |

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

interface IButtonProps {
    name: string;
}
class MyBlock extends Block<IButtonProps> {
    block = this.props.name;
}

ReactDOM.render(
    <MyBlock name='MyBlock' />,
    document.getElementById('root')
);
```

Result:

```html
<div name='MyBlock' class='MyBlock'></div>
```

### Elem

```tsx
class ... extends Elem<IProps, IState> {
    ...
}
```

The base class for creating block elements. [An element](https://en.bem.info/methodology/quick-start/#element) is a part of a block that cannot be used without the block itself.

> **Note:** For more information about methods for manipulating an element, see: [Class methods](#elem-1).

#### Class fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `block` (required) | `string` | Block name. Sets the namespace for the element's CSS class. |
| `elem` (required) | `string` | Element name. Used in creating the element's CSS class and is separated from the block by a hyphen (`-`). |

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem } from 'bem-react-core';

interface IElemProps {
    name: string;
}
class Text extends Elem<IElemProps> {
    block = 'MyBlock';
    elem = this.props.name;
}
class MyBlock extends Block {
    block = 'MyBlock';
    content() {
        return (
            <Text name='Text'/>
        )
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock'>
    <div name='Text' class='MyBlock-Text'></div>
</div>
```

### withMods()

```tsx
withMods(entity, ...entityMod);
```

Defines block or element modifiers.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem, withMods } from 'bem-react-core';

interface IButtonProps {
    children: string;
}
interface IModsProps extends IButtonProps {
    size: 'm' | 's';
    theme: 'normal' | 'default';
}
// Creating the Text element
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
    tag() {
        return 'span';
    }
}
// Creating a Button block
class Button extends Block<IModsProps> {
    block = 'Button';
    tag() {
        return 'button';
    }
    mods() {
        return {
            theme: this.props.theme
        };
    }
    content() {
        return (
            <Text>{this.props.children}</Text>
        );
    }
}
/* Extending functionality of the Button block when 
the "theme" property is set to the value "default"
*/
function ButtonSize() {
    return class ButtonSize extends Button {
        static mod = ({theme}: any) => theme === 'default';
        mods() {
            return {
                ...super.mods(),
                size: this.props.size
            };
        }
    }
}
// Combining Button and ButtonSize classes
const ButtonView = withMods(Button, ButtonSize);

ReactDOM.render(
    <ButtonView theme='default' size='m'>Click me</ButtonView>,
    document.getElementById('root')
);
```

Result:

```html
<button theme='default' class='Button Button_theme_default Button_size_m'>
    <span class='Button-Text'>Click me</span>
</button>
```

### Bem

Helper for creating custom HTML elements with the name of the CSS class formed using the BEM methodology.

> **Note:** Learn more about the [Bem helper](#bem-helper) properties.

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
        <Bem block='MyBlock' elem='Inner' elemMods={{theme: 'default'}} />
        <Bem block='MyBlock' style={{
            'background': '#ff0000',
            'height': '100px',
            'width': '100px'
        }}/>
        <Bem block='MyBlock' mix={{
            block: 'Header',
            elem: 'MyBlock'
        }} />
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
<div class='MyBlock-Inner MyBlock-Inner_theme_default'></div>
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
<div class='MyBlock Header-MyBlock'></div>
```

## Class methods

### Block

| Method | Description |
| ------ | ----------- |
| [attrs()](#attrs) | Defines the HTML attributes of a block or element. |
| [content()](#content) | Defines the content of a block or element. |
| [mix()](#mix) | Defines a [mix](https://en.bem.info/methodology/key-concepts/#mix) of a block or element. |
| [mods()](#mods) | Defines block modifiers. |
| [replace()](#replace) | Replaces the current block or element with custom HTML markup. |
| [style()](#style) | Defines inline CSS properties of an HTML element using the  `style` attribute. |
| [tag()](#tag) | Defines the HTML tag of a block or element. |
| [wrap()](#wrap) | Defines a custom HTML wrapper. |

#### attrs()

```tsx
attrs(props: IProps, state: IState): object
```

Defines the HTML attributes of a block or element.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    attrs() {
        return { id: 'the-id' };
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div id='the-id' class='MyBlock'></div>
```

#### content()

```tsx
content(props: IProps, state: IState): (string | ReactElement)[]
```

Defines the content of a block or element.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    content() {
        return 'Some Text';
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock'>Some Text</div>
```

#### mix()

```tsx
mix(props: IProps, state: IState): object | ReactElement | (object | ReactElement)[]
```

Defines the block or element [mix](https://en.bem.info/methodology/quick-start/#mix). Mixes allow you to combine multiple entities on the same DOM node.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    mix() {
        return {
            block: 'Header',
            elem: 'MyBlock'
        }
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock Header-MyBlock'></div>
```

#### mods()

```tsx
mods(props: IProps, state: IState): object
```

Defines block modifiers.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    mods() {
        return {
            theme: 'default',
        }
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock MyBlock_theme_default'></div>
```

#### replace()

```tsx
replace(props: IProps, state: IState): (object | ReactElement)[]
```

Replaces the current block or element with custom HTML markup.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class OtherBlock extends Block {
    block = 'OtherBlock';
}
class MyBlock extends Block {
    block = 'MyBlock';
    replace() {
        return (
            <OtherBlock />
        );
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='OtherBlock'></div>
```

#### style()

```tsx
style(props: IProps, state: IState): object
```

Defines inline CSS properties of an HTML element using the  `style` attribute.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    style() {
        return {
            'background': '#ff0000',
            'height': '100px',
            'width': '100px'
        }
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
```

#### tag()

```tsx
tag(props: IProps, state: IState): string
```

Defines the HTML tag of a block or element. Default: `div`.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    tag() {
        return 'span';
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<button class='MyBlock'></button>
```

#### wrap()

```tsx
wrap(props: IProps, state: IState, component: ReactElement): ReactElement
```

Defines a custom HTML wrapper.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Entity } from 'bem-react-core';

class MyBlock extends Block {
    block = 'MyBlock';
    wrap(props: any, state: any, component: MyBlock): Entity {
        return <div className='Wrapper'>{component}</div>;
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='Wrapper'>
    <div class='MyBlock'></div>
</div>
```

### Elem

Methods for manipulating instances of elements. The `Elem` class inherits the methods of the [Block](#block-1) class, except for methods that define the modifiers:

| Method | Description |
| ----- | -------- |
| [elemMods()](#elemmods) | Defines element modifiers. |

#### elemMods()

```tsx
elemMods(props: IProps, state: IState): object
```

Defines element modifiers.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem } from 'bem-react-core';

class Icon extends Elem {
    block = 'MyBlock';
    elem = 'Icon';
    elemMods() {
        return {
            size: 'm',
        }
    }
}

class MyBlock extends Block {
    block = 'MyBlock';
    content() {
        return (
            <Icon />
        );
    }
}

ReactDOM.render(
    <MyBlock />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock'>
    <div class='MyBlock-Icon MyBlock-Icon_size_m'></div>
</div>
```

## External API

### className

Defines an additional CSS class for block and element instances.

Example:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    // Main CSS class
    block = 'MyBlock';
}

ReactDOM.render(
    // Additional CSS class
    <MyBlock className='OtherBlock' />,
    document.getElementById('root')
);
```

Result:

```html
<div class='MyBlock OtherBlock'></div>
```

### Bem helper properties

Available properties:

| Method | Accepted value type | Description |
| ----- | ------------------- | -------- |
| `block` | `string` | Defines the block name. |
| `elem` | `string` | Defines the element name. Must be used with `block`. |
| `tag` | `string` | Defines the HTML tag of a block or element. |
| `mods` | `object`, ` object[]` | Defines block modifiers. Must be used with `block`. |
| `elemMods` | `object`, ` object[]` | Defines element modifiers. Must be used with `block` and `elem`. |
| `style` | `object` | Defines inline CSS properties of an HTML element using the  `style` attribute. |
| `mix` | `object` | Defines a [mix](https://en.bem.info/methodology/key-concepts/#mix) of a block or element. |

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
        <Bem block='MyBlock' elem='Inner' elemMods={{theme: 'default'}} />
        <Bem block='MyBlock' style={{
            'background': '#ff0000',
            'height': '100px',
            'width': '100px'
        }}/>
        <Bem block='MyBlock' mix={{
            block: 'Header',
            elem: 'MyBlock'
        }} />
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
<div class='MyBlock-Inner MyBlock-Inner_theme_default'></div>
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
<div class='MyBlock Header-MyBlock'></div>
```
