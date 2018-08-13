# Справочник API

> **Примечание.** Справочник содержит описание программного интерфейса `bem-react-core` API версии 2.0.0. Данная версия API поддерживает аннотации типов TypeScript и Flow.

* [API](#api)
    * [Block](#block)
    * [Elem](#elem)
    * [withMods()](#withmods)
    * [Bem](#bem)
* [Методы классов](#Методы-классов)
    * [Block](#block-1)
    * [Elem](#elem-1)
* [Внешнее API](#Внешнее-api)
    * [className](#classname)
    * [Свойства хелпера Bem](#Свойства-хелпера-bem)

## API

### Block

```tsx
class ... extends Block<IProps, IState> {
    ...
}
```

Базовый класс для создания блоков. Блоки позволяют разделить пользовательский интерфейс на независимые, многократно используемые части.

> **Примечание.** Подробнее о методах манипулирования блоком см. в разделе [Методы классов](#Методы-классов).

#### Поля класса

| Поле | Тип | Описание |
| ---- | --- | -------- |
| `block` (required) | `string` | Имя блока. Определяет CSS-класс блока. |

Пример:

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

Результат:

```html
<div name='MyBlock' class='MyBlock'></div>
```

### Elem

```tsx
class ... extends Elem<IProps, IState> {
    ...
}
```

Базовый класс для создания элементов блоков. [Элемент](https://ru.bem.info/methodology/quick-start/#Элемент) — составная часть блока, которая не может использоваться в отрыве от него.

> **Примечание.** Подробнее о методах манипулирования элементом см. в разделе [Методы классов](#elem-1).

#### Поля класса

| Поле | Тип | Описание |
| ---- | --- | -------- |
| `block` (required) | `string` | Имя блока. Задает пространство имен для CSS-класса элемента. |
| `elem` (required) | `string` | Имя элемента. Используется в построении CSS-класса элемента и отделяется от имени блока дефисом (`-`). |

Пример:

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

Результат:

```html
<div class='MyBlock'>
    <div name='Text' class='MyBlock-Text'></div>
</div>
```

### withMods()

```tsx
withMods(entity, ...entityMod);
```

Определяет модификаторы блока либо элемента.

Пример:

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
// Создание элемента Text
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
    tag() {
        return 'span';
    }
}
// Создание блока Button
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
// Расширение функциональности блока Button, при наличии свойства theme со значением default
class ButtonSize extends Button {
    static mod = ({theme}: any) => theme === 'default';
    mods() {
        return {
            ...super.mods(),
            size: this.props.size
        };
    }
}
// Объединение классов Button и ButtonSize
const ButtonView = withMods(Button, ButtonSize);

ReactDOM.render(
    <ButtonView theme='default' size='m'>Click me</ButtonView>,
    document.getElementById('root')
);
```

Результат:

```html
<button theme='default' class='Button Button_theme_default Button_size_m'>
    <span class='Button-Text'>Click me</span>
</button>
```

### Bem

Хелпер для создания произвольных HTML-элементов с именем CSS-класса сформированным по БЭМ-методологии.

> **Примечание.** Подробнее о [свойствах Bem](#Свойства-хелпера-bem).

Пример:

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

Результат:

```html
<div class='MyBlock'></div>
<div class='MyBlock-Inner'></div>
<span class='MyBlock'></span>
<div class='MyBlock MyBlock_theme_default'></div>
<div class='MyBlock-Inner MyBlock-Inner_theme_default'></div>
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
<div class='MyBlock Header-MyBlock'></div>
```

## Методы классов

### Block

Методы для манипулирования экземплярами блоков:

| Метод | Описание |
| ----- | -------- |
| [attrs()](#attrs) | Определяет HTML-атрибуты блока или элемента. |
| [content()](#content) | Определяет содержимое блока или элемента. |
| [mix()](#mix) | Определяет [микс](https://ru.bem.info/methodology/key-concepts/#Микс) блока или элемента. |
| [mods()](#mods) | Определяет модификаторы блока. |
| [style()](#style) | Определяет инлайновые CSS-свойства HTML-элемента с помощью атрибута `style`. |
| [tag()](#tag) | Определяет HTML-тег блока или элемента. |

#### attrs()

```tsx
attrs(props: IProps, state: IState): object
```

Определяет HTML-атрибуты блока или элемента.

Пример:

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

Результат:

```html
<div id='the-id' class='MyBlock'></div>
```

#### content()

```tsx
content(props: IProps, state: IState): (string | ReactElement)[]
```

Определяет содержимое блока или элемента.

Пример:

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

Результат:

```html
<div class='MyBlock'>Some Text</div>
```

#### mix()

```tsx
mix(props: IProps, state: IState): object | ReactElement | (object | ReactElement)[]
```

Определяет [микс](https://ru.bem.info/methodology/quick-start/#Микс) блока или элемента. Миксы позволяют совместить несколько сущностей на одном DOM-узле.

Пример:

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

Результат:

```html
<div class='MyBlock Header-MyBlock'></div>
```

#### mods()

```tsx
mods(props: IProps, state: IState): object
```

Определяет модификаторы блока.

Пример:

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

Результат:

```html
<div class='MyBlock MyBlock_theme_default'></div>
```

#### style()

```tsx
style(props: IProps, state: IState): object
```

Определяет инлайновые CSS-свойства HTML-элемента с помощью атрибута `style`.

Пример:

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

Результат:

```html
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
```

#### tag()

```tsx
tag(props: IProps, state: IState): string
```

Определяет HTML-тег блока или элемента. По умолчанию: `div`.

Пример:

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

Результат:

```html
<button class='MyBlock'></button>
```

### Elem

Методы для манипулирования экземплярами элементов. Класс `Elem` наследует методы класса [Block](#block-1), кроме метода определения модификаторов:

| Метод | Описание |
| ----- | -------- |
| [elemMods()](#elemmods) | Определяет модификаторы элемента. |

#### elemMods()

```tsx
elemMods(props: IProps, state: IState): object
```

Определяет модификаторы элемента.

Пример:

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

Результат:

```html
<div class='MyBlock'>
    <div class='MyBlock-Icon MyBlock-Icon_size_m'></div>
</div>
```

## Внешний API

### className

Определяет дополнительный CSS-класс экземплярам блоков и элементов.

Пример:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class MyBlock extends Block {
    // Основной CSS-класс
    block = 'MyBlock';
}

ReactDOM.render(
    // Дополнительный CSS-класс
    <MyBlock className='OtherBlock' />,
    document.getElementById('root')
);
```

Результат:

```html
<div class='MyBlock OtherBlock'></div>
```

### Свойства хелпера Bem

Список доступных свойств:

| Метод | Тип принимаемых значений | Описание |
| ----- | ------------------- | -------- |
| `block` | `string` | Определяет имя блока. |
| `elem` | `string` | Определяет имя элемента. Необходимо использовать со свойством `block`. |
| `tag` | `string` | Определяет HTML-тег блока или элемента. |
| `mods` | `object`, ` object[]` | Определяет модификаторы блока. Необходимо использовать со свойством `block`. |
| `elemMods` | `object`, `object[]` | Определяет модификаторы элемента. Необходимо использовать со свойствами `block` и `elem`. |
| `style` | `object` | Определяет инлайновые CSS-свойства HTML-элемента с помощью атрибута `style`. |
| `mix` | `object` | Определяет [микс](https://ru.bem.info/methodology/key-concepts/#Микс) блока или элемента. |

Пример:

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

Результат:

```html
<div class='MyBlock'></div>
<div class='MyBlock-Inner'></div>
<span class='MyBlock'></span>
<div class='MyBlock MyBlock_theme_default'></div>
<div class='MyBlock-Inner MyBlock-Inner_theme_default'></div>
<div class='MyBlock' style='background: rgb(255, 0, 0); height: 100px; width: 100px;'></div>
<div class='MyBlock Header-MyBlock'></div>
```
