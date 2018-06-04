# Миграция

## Переход v1.0 → v2.0

Руководство содержит примеры, демонстрирующие различия между API `bem-react-core` версий 1.0 и 2.0. В разделе рассматриваются только те операции с API, в которых нарушена обратная совместимость.

* [Создание блоков и элементов](#Создание-блоков-и-элементов)
* [Создание модификаторов](#Создание-модификаторов)
* [Методы классов Block и Elem](#Методы-классов-block-и-elem)
* [lifecycle-методы](#lifecycle-методы)

### Создание блоков и элементов

| v1.0 | v2.0 |
| ---- | ---- |
| decl() | Удален. Используйте класс [Block](REFERENCE.md#block) для создания блоков, класс [Elem](REFERENCE.md#elem) для создания элементов. |

Было:

```jsx
import { decl } from 'bem-react-core';

// Создание элемента Text
export default decl({
    block : 'Button',
    elem : 'Text'
});
// Создание блока Button
export default decl({
    block : 'Button'
});
```

Стало:

```tsx
import { Block, Elem } from 'bem-react-core';

// Создание элемента Text
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
}
// Создание блока Button
class Button extends Block {
    block = 'Button';
}
```

### Создание модификаторов

| v1.0 | v2.0 |
| ---- | ---- |
| declMod() `deprecated` | Используйте [HOC](https://reactjs.org/docs/higher-order-components.html) функцию [withMods()](REFERENCE.md#withmods). |

Было:

```jsx
import { declMod } from 'bem-react-core';

// Создание модификаторов: 
// theme со значением default
// size со значением m
export default declMod({ theme : 'default', size : 'm' }, {
    block : 'Button'
    ...
});
```

Стало:

```tsx
import { Block, withMods } from 'bem-react-core';

// Создание блока Button с модификатором theme
class Button extends Block {
    block = 'Button';
    mods() {
        return {
            theme: 'default'
        }
    }
}
// Создание модификатора size для блока Button
function ButtonSize() {
    return class ButtonSize extends Button {
        mods() {
            return {
                ...super.mods(),
                size: 'm'
            };
        }
    }
}

const ButtonView = withMods(Button, ButtonSize);
```

### Методы классов Block и Elem

| v1.0 | v2.0 |
| ---- | ---- |
| addMix() | Удален. Используйте метод [mix()](REFERENCE.md#mix). |
| addBemClassName() | Удален. |
| cls() `deprecated` | Используйте [className](REFERENCE.md#classname). |

### lifecycle-методы

| v1.0 | v2.0 |
| ---- | ---- |
| willInit() `deprecated` | Используйте [constructor()](https://reactjs.org/docs/react-component.html#constructor). |
| willMount() `deprecated` | Используйте [componentWillMount()](https://reactjs.org/docs/react-component.html#unsafe_componentwillmount). |
| didMount() `deprecated` | Используйте [componentDidMount()](https://reactjs.org/docs/react-component.html#componentdidmount). |
| willReceiveProps() `deprecated` | Используйте [componentWillReceiveProps()](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops). |
| shouldUpdate() `deprecated` | Используйте [shouldComponentUpdate()](https://reactjs.org/docs/react-component.html#shouldcomponentupdate). |
| willUpdate() `deprecated` | Используйте [componentWillUpdate()](https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate). |
| didUpdate() `deprecated` | Используйте [componentDidUpdate()](https://reactjs.org/docs/react-component.html#componentdidupdate). |
| willUnmount() `deprecated` | Используйте [componentWillUnmount()](https://reactjs.org/docs/react-component.html#componentwillunmount). |

