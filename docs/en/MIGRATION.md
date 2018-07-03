# Migration

## Migrating from v1.0 to v2.0

This guide contains examples that show the differences between `bem-react-core` API versions 1.0 and 2.0. This section covers only those operations with the API that break backward compatibility.

* [Creating blocks and elements](#creating-blocks-and-elements)
* [Creating modifiers](#creating-modifiers)
* [Block and Elem class methods](#block-and-elem-class-methods)
* [Lifecycle methods](#lifecycle-methods)

### Creating blocks and elements

| v1.0 | v2.0 |
| ---- | ---- |
| decl() | Removed. Use the [Block](REFERENCE.md#block) class to create blocks and the [Elem](REFERENCE.md#elem) class to create elements. |

Before:

```jsx
import { decl } from 'bem-react-core';

// Creating the Text element
export default decl({
    block:'Button',
    elem:'Text'
});
// Creating a Button block
export default decl({
    block:'Button'
});
```

Now:

```tsx
import { Block, Elem } from 'bem-react-core';

// Creating the Text element
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
}
// Creating a Button block
class Button extends Block {
    block = 'Button';
}
```

### Creating modifiers

| v1.0 | v2.0 |
| ---- | ---- |
| declMod() `deprecated` | Use the [HOC](https://reactjs.org/docs/higher-order-components.html) function [withMods()](REFERENCE.md#withmods). |

Before:

```jsx
import { declMod } from 'bem-react-core';

// Creating modifiers:
// "theme" with the value "default"
// "size" with the value "m"
export default declMod({ theme : 'default', size : 'm' }, {
    block : 'Button'
    ...
});
```

Now:

```tsx
import { Block, withMods } from 'bem-react-core';

// Creating the Button block with the theme modifier
class Button extends Block {
    block = 'Button';
    mods() {
        return {
            theme:'default'
        }
    }
}
// Creating the size modifier for the Button block
class ButtonSize extends Button {
    static mod = ({ size }: any) => size === 'm';

    mods() {
        return {
            ...super.mods(),
            size: 'm'
        };
    }
}

const ButtonView = withMods(Button, ButtonSize);
```

### Block and Elem class methods

| v1.0 | v2.0 |
| ---- | ---- |
| addMix() | Removed. Use [mix()](REFERENCE.md#mix). |
| addBemClassName() | Removed. |
| cls() `deprecated` | Use [className](REFERENCE.md#classname). |

### Lifecycle methods

| v1.0 | v2.0 |
| ---- | ---- |
| willInit() `deprecated` | Use [constructor()](https://reactjs.org/docs/react-component.html#constructor). |
| willMount() `deprecated` | Use [componentWillMount()](https://reactjs.org/docs/react-component.html#unsafe_contentwillmount). |
| didMount() `deprecated` | Use [componentDidMount()](https://reactjs.org/docs/react-component.html#componentdidmount). |
| willReceiveProps() `deprecated` | Use [componentWillReceiveProps()](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops). |
| shouldUpdate() `deprecated` | Use [shouldComponentUpdate()](https://reactjs.org/docs/react-component.html#shouldcomponentupdate). |
| willUpdate() `deprecated` | Use [componentWillUpdate()](https://reactjs.org/docs/react-component.html#unsafe_contentwillupdate). |
| didUpdate() `deprecated` | Use [componentDidUpdate()](https://reactjs.org/docs/react-component.html#componentdidupdate). |
| willUnmount() `deprecated` | Use [componentWillUnmount()](https://reactjs.org/docs/react-component.html#componentwillunmount). |
