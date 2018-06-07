# API Reference

* [Declaration](#declaration)  
  * [decl()](#declbase--fields--staticfields-wrapper)  
  * [declMod()](#declmodpredicate-fields--staticfields)
* [Fields and methods](#fields-and-methods)
  * [block](#block-string)
  * [elem](#elem-string)
  * [tag()](#tag-string--functionprops-state-string)
  * [attrs()](#attrs-object--functionprops-state-object)
  * [style()](#style-object--functionprops-state-object)
  * [cls()](#cls-string--functionprops-state-string)
  * [mods()](#mods-object--functionprops-state-object)
  * [mix()](#mix-object--reactelement--arrayany--functionprops-state-object--reactelement--arrayany)
  * [addMix()](#addmix-object--reactelement--array--functionprops-state-object--reactelement--array)
  * [content()](#content-string--reactelement--array--functionprops-state-string--reactelement--array)
  * [replace()](#replace-functionprops-state-string--reactelement--array)
  * [wrap()](#wrap-functionprops-state-reactelement-reactelement)
  * [addBemClassName()](#addbemclassname-boolean--functionprops-state-boolean)
* [Methods](#methods)
* [Static fields](#static-fields)

## Declaration

### `decl([base ,] fields [, staticFields, wrapper])`

* base `[{Object|Array}]` – base class \(block or element\) and/or array of mixins.
* fields `{Object}` – instance's fields and methods
* staticFields `{Object}` – static fields and methods
* wrapper `{Function}` - custom function to wrap component with [HOC](https://facebook.github.io/react/docs/higher-order-components.html)
  You need to use this function to wrap components because `decl` doesn't return React-component.
  This function will be called after all declarations are applied and React-component is created.

### `declMod(predicate, fields [, staticFields])`

* predicate `{Object|Function}` – modifier matcher or custom match function 
* fields `{Object}` – instance's fields and methods
* staticFields `{Object}` – static fields and methods

When you use modifier matcher object as a first argument, the `mods` will be set automatically.

```jsx
// MyBlock_myMod1_myVal1.js

import { declMod } from 'bem-react-core';

export default declMod({ myMod1 : 'myVal1' }, {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod1 with value myVal1.',
            this.__base(...arguments)
        ];
    }
});
```

```jsx
// MyBlock_myMod1.js

import { declMod } from 'bem-react-core';

export default declMod({ myMod1 : '*' }, {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod1 with any value.',
            this.__base(...arguments)
        ];
    }
});
```

```jsx
// MyBlock_myMod1.js

import { declMod } from 'bem-react-core';

export default declMod({ myMod1 : 'myVal1', myMod2 : 'myVal2' }, {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod1 with value myVal1 and myMod2 with value myVal2.',
            this.__base(...arguments)
        ];
    }
});
```

```jsx
// MyBlock_myMod1.js

import { declMod } from 'bem-react-core';

export default declMod({ myMod1 : ({ myMod1, customProp }) => myMod1 === customProp }, {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod1 with custom match function.',
            this.__base(...arguments)
        ];
    }
});
```

Modifier declaration may get custom match function as a first argument.  
This function gets props as an argument and it should return boolean result.  
If this function returns `true`, declaration will be applied to the component.  
In this case if you need CSS classes, you have to operate with `mods` implicitly.

```jsx
// MyBlock_myMod1.js

import { declMod } from 'bem-react-core';

export default declMod(({ myMod1 }) => myMod1 && myMod1 !== 'myVal1', {
    block : 'MyBlock',
    mods({ myMod1 }) {
        return { ...this.__base(...arguments), myMod1 };
    },
    content() {
        return [
            'Modification for myMod1 with any value except myVal1.',
            this.__base(...arguments)
        ];
    }
});
```

## Fields and methods

### block &lt;string&gt;

Block name. It's used for CSS class generation.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock'
});
```

```jsx
<MyBlock/>
```

```html
<div class="MyBlock"></div>
```

### elem &lt;string&gt;

Elem name. It's used for CSS class generation.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    elem : 'MyElem'
});
// <MyBlockElem/>
```

```jsx
<MyBlockElem/>
```

```html
<div class="MyBlock-MyElem"></div>
```

### tag &lt;string \| function\(props, state\): string&gt;

HTML tag for component, default: `div`.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    tag : 'span'
});
```

```jsx
<MyBlock/>
```

```html
<span class="MyBlock"></span>
```

### attrs &lt;object \| function\(props, state\): object&gt;

HTML attributes and React bindings.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    attrs({ id }) {
        return {
            id,
            tabIndex : -1,
            onClick : () => console.log('clicked')
        };
    }
});
```

```jsx
<MyBlock id="the-id"/>
```

```html
<div class="MyBlock" id="the-id" tabindex="-1"></div>
```

### style &lt;object \| function\(props, state\): object&gt;

Helper for style attribute.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    style({ width, height }) {
        return {
            width,
            height
        };
    }
});
```

```jsx
<MyBlock width="100px" height="100px" />
```

```html
<div class="MyBlock" style="width:100px; height: 100px"></div>
```

### cls &lt;string \| function\(props, state\): string&gt;

Additional custom CSS class.

From JSX:

```jsx
<MyBlock cls="custom-class"/>
```

```html
<div class="MyBlock custom-class"></div>
```

From declaration:

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    cls({ customClass }) {
        return `${customClass} decl-custom-class`;
    }
});
```

```jsx
<MyBlock customClass="props-custom-class"/>
```

```html
<div class="MyBlock props-custom-class decl-custom-class"></div>
```

### mods &lt;object \| function\(props, state\): object&gt;

Block or element modifiers. All keys are used for CSS class generation.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mods({ disabled }) {
        return {
            disabled,
            forever : 'together'
        };
    }
});
```

```jsx
<MyBlock disabled/>
```

```html
<div class="MyBlock MyBlock_disabled MyBlock_forever_together"></div>
```

### mix &lt;object \| ReactElement | Array&lt;any&gt; \| function\(props, state\): object \| ReactElement \| Array&lt;any&gt;&gt;

[BEM mixes](https://en.bem.info/methodology/key-concepts/#mix)

Field `mix` accepts object or array of objects with next properties:

* block
* mods
* elem
* elemMods – back compatibility for the different BEM-tools. `mods` will be ignored in this case.

Other properties will be ignored.

From JSX:

```jsx
<MyBlock mix={{ block : 'MixedBlock' }}/>
<MyBlock mix={[{ block : 'MixedBlock' }, { block : 'MixedBlock2', elem : 'MixedElem2' }]}/>
<MyBlock mix={[{ block : 'MixedBlock' }, { block : 'MixedBlock2', elem : 'MixedElem2', mods : { m1: 'v1' } }]}/>
<MyBlock mix={[{ block : 'MixedBlock' }, { block : 'MixedBlock2', elem : 'MixedElem2', elemMods : { m1: 'v1' } }]}/>
```

```html
<div class="MyBlock MixedBlock"></div>
<div class="MyBlock MixedBlock MixedBlock2-MixedElem2"></div>
<div class="MyBlock MixedBlock MixedBlock2-MixedElem2 MixedBlock2-MixedElem2_m1_v1"></div>
<div class="MyBlock MixedBlock MixedBlock2-MixedElem2 MixedBlock2-MixedElem2_m1_v1"></div>
```

From declaration:

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mix({ mixedElem }) {
        return { block : 'MixedBlock2', elem : mixedElem };
    }
});
```

```jsx
<MyBlock mixedElem="MixedElem2"/>
```

```html
<div class="MyBlock MixedBlock2-MixedElem2"></div>
```

### addMix &lt;object \| ReactElement \| array \| function\(props, state\): object \| ReactElement \| array&gt;

\`addMix\` unlike \`mix\`, extends already declared mix.

From declaration and from JSX:

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    addMix({ mixedElem }) {
        return { block : 'MixedBlock2', elem : mixedElem };
    }
});
```

```jsx
<MyBlock mixedElem="MixedElem2" mix={{ block : 'MixedBlock' }}/>
```

```html
<div class="MyBlock MixedBlock2-MixedElem2 MixedBlock"></div>
```

### content &lt;string \| ReactElement \| array \| function\(props, state\): string \| ReactElement \| array&gt;

The content of the component.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    content({ greeting, children }) {
        return `${greeting}. ${children}`;
    }
});
```

```jsx
<MyBlock greeting="Mr">Black</MyBlock>
```

```html
<div class="MyBlock">Mr. Black</div>
```

### replace &lt;function\(props, state\): string \| ReactElement \| array&gt;

Method that replaces whole component.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    replace({ greeting, children }) {
        return `${greeting}. ${children}`;
    }
});
```

```jsx
<div><MyBlock greeting="Mr">Black</MyBlock></div>
```

```html
<div>Mr. Black</div>
```

### wrap &lt;function\(props, state, ReactElement\): ReactElement&gt;

This method helps to wrap current component to another component, DOM element or any other combination of them.  
The `wrap` gets current React component as a first argument.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    wrap(props, state, component) {
        return <section>{component}</section>;
    }
});
```

```jsx
<MyBlock/>
```

```html
<section>
    <div class="MyBlock"></div>
</section>
```

### addBemClassName &lt;boolean \| function\(props, state\): boolean&gt;

This method prevents BEM className generation.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    addBemClassName: false,
    cls: 'btn'
});
```

```jsx
<MyBlock/>
```

```html
<div class="btn"></div>
```

## Methods

It's [default lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle) of React component, but we removed word `component` from methods names.  
All of this methods can be redefined on other levels or by modifiers like any other fields and methods.

```js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    willInit() {
        // original name: constructor
    },
    willMount() {
        // original name: componentWillMount
    },
    didMount() {
        // original name: componentDidMount
    },
    willReceiveProps() {
        // original name: componentWillReceiveProps
    },
    shouldUpdate() {
        // original name: shouldComponentUpdate
    },
    willUpdate() {
        // original name: componentWillUpdate
    },
    didUpdate() {
        // original name: componentDidUpdate
    },
    willUnmount() {
        // original name: componentWillUnmount
    },
    didCatch() {
        // original name: componentDidCatch
    }
});
```

## Static fields

```js
import PropTypes from 'prop-types';
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock'
}, {
    propTypes : {
        theme : PropTypes.string.isRequired,
        size : PropTypes.oneOf(['s', 'm', 'l'])
    },
    defaultProps : {
        theme : 'normal'
    }
});
```
