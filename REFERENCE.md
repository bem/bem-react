# Reference

## Declaration

### `decl([base ,] prototypeProps [, staticProps, wrapper])`

- base `[{Object|Array}]` – base class (block or element) and/or array of mixins
- prototypeProps `{Object}` – instance's fields and methods
- staticProps `{Object}` – static fields and methods
- wrapper `{Function}` - произвольная функция-обертка для использования [HOC](https://facebook.github.io/react/docs/higher-order-components.html).
Вы можете использовать эту функцию для оборачивания компонентов, так как `decl` не возвращает React-компонент.
Эта функция будет вызвана после того как все декларации применятся и будет создан React-компонент.

### `declMod(predicate, prototypeProps [, staticProps])`

- predicate `{Object|Function}` – modifier matcher or custom match function
- prototypeProps `{Object}` – instance's fields and methods
- staticProps `{Object}` – static fields and methods

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

## Default fields and methods

All methods get props as an argument. Only [`wrap`](#wrap) and [`content`](#content) work with the different arguments.

### block

Block name. It's used for CSS class generation.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock'
});
```
``` jsx
<MyBlock/>
```
``` html
<div class="MyBlock"></div>
```

### elem

Elem name. It's used for CSS class generation.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    elem : 'MyElem'
});
// <MyBlockElem/>
```
``` jsx
<MyBlockElem/>
```
``` html
<div class="MyBlock-MyElem"></div>
```

### tag

HTML tag for component, default: `div`.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    tag : 'span'
});
```
``` jsx
<MyBlock/>
```
``` html
<span class="MyBlock"></span>
```

### attrs

HTML attributes and React bindings.

``` js
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
``` jsx
<MyBlock id="the-id"/>
```
``` html
<div class="MyBlock" id="the-id" tabindex="-1"></div>
```

### cls

Additional custom CSS class.

From JSX:
``` jsx
<MyBlock cls="custom-class"/>
```
``` html
<div class="MyBlock custom-class"></div>
```

From declaration:
``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    cls({ customClass }) {
        return `${customClass} decl-custom-class`;
    }
});
```
``` jsx
<MyBlock customClass="props-custom-class"/>
```
``` html
<div class="MyBlock props-custom-class decl-custom-class"></div>
```

### mods

Block or elem modifiers. All keys are used for CSS class generation.

``` js
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
``` jsx
<MyBlock disabled/>
```
``` html
<div class="MyBlock MyBlock_disabled MyBlock_forever_together"></div>
```

### mix

[BEM mixes](https://en.bem.info/methodology/key-concepts/#mix).

From JSX:
``` jsx
<MyBlock mix={{ block : 'MixedBlock' }}/>
<MyBlock mix={[{ block : 'MixedBlock' }, { block : 'MixedBlock2', elem : 'MixedElem2' }]}/>
```
``` html
<div class="MyBlock MixedBlock"></div>
<div class="MyBlock MixedBlock MixedBlock2-MixedElem2"></div>
```

From declaration:
``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mix({ mixedElem }) {
        return { block : 'MixedBlock2', elem : mixedElem };
    }
});
```
``` jsx
<MyBlock mixedElem="MixedElem2"/>
```
``` html
<div class="MyBlock MixedBlock2-MixedElem2"></div>
```

### content

The content of the component. This method gets props as a first argument and `this.props.children` as a second one.
This method should return: string, React component, array of strings and/or React components.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    content({ greeting }, children) {
        return `${greeting}. ${children}`;
    }
});
```
``` jsx
<MyBlock greeting="Mr">Black</MyBlock>
```
``` html
<div class="MyBlock">Mr. Black</div>
```

### wrap

This method helps to wrap current component to another component, DOM element or any other combination of them.
The `wrap` gets current React component as a first argument.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    wrap(component) {
        return <section>{component}</section>;
    }
});
```
``` jsx
<MyBlock/>
```
``` html
<section>
    <div class="MyBlock"></div>
</section>
```

## Lifecycle methods

It's [default lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle)
of React component, but we removed word `component` from methods names.
All of this methods can be redefined on other levels or by modifiers like any other fields and methods.

``` js
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
    render() {
        // Current component will be rewrited. CSS class generation, 
        // default fields and methods will be ignored.
    }
});
```

## Class properties

Should be declared in the staic fields.

``` js
import { PropTypes } from 'react';
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

