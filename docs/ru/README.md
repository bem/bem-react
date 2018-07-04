# Bem React Core

Библиотека для разработки пользовательских интерфейсов по [БЭМ-методологии](https://ru.bem.info) на [React](https://github.com/facebook/react). Bem React Core поддерживает аннотации типов TypeScript и Flow.

* [Установка](#Установка)
* [Быстрый старт](#Быстрый-старт)
  * [Hello, world](#hello-world)
* [Основы](#Основы)
  * [Создание блоков](#Создание-блоков)
  * [Создание элементов](#Создание-элементов)
  * [Создание модификаторов](#Создание-модификаторов)
  * [Создание дополнительной HTML-разметки](#Создание-дополнительной-html-разметки)
* [Работа с CSS](#Работа-с-css)
  * [Генерация CSS-классов](#Генерация-css-классов)
* [Справочник API](#Справочник-api)
* [Руководство по переходу на API v2.0](#Руководство-по-переходу-на-api-v20)
* [Версии API](#Версии-api)
* [Внести вклад](#Внести-вклад)
* [Лицензия](#Лицензия)

## Установка

С помощью [npm](https://www.npmjs.com):

```bash
npm init
npm install --save bem-react-core react react-dom
```

С помощью [Yarn](https://yarnpkg.com/en/):

```bash
yarn init
yarn add bem-react-core react react-dom
```

## Быстрый старт

Создадим приложение, которое будет показывать пользователю диалоговое окно с сообщением «Hello, World!» при нажатии на кнопку.

Быстрый способ развернуть React-проект с нуля и начать работать с `bem-react-core` — воспользоваться утилитой [BEM React Boilerplate](https://github.com/bem/bem-react-boilerplate).

### Hello, World

#### Установка `bem-react-boilerplate`

```bash
git clone git@github.com:bem/bem-react-boilerplate.git bem-in-react
cd bem-in-react
npm install
npm start
```

#### Содержимое `src/index.tsx`

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

Перейдите по адресу [localhost:3000](http://localhost:3000/), чтобы увидеть ваше приложение.

Чтобы писать более сложные проекты на `bem-react-core`, ознакомьтесь с [основами](#Основы) и [справочником API](#Справочник-api).

## Основы

### Создание блоков

[Блок](https://ru.bem.info/methodology/quick-start/#Блок) — функционально независимый компонент пользовательского интерфейса, который может быть повторно использован. Чтобы создать блок, необходимо импортировать класс [Block](REFERENCE.md#block) из библиотеки `bem-react-core`. Это базовый класс для создания экземпляров блоков.

Пример:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block } from 'bem-react-core';

class Button extends Block {
    block = 'Button';

    tag() {
        return 'button';
    }
}

ReactDOM.render(
    <Button>Click me</Button>,
    document.getElementById('root')
);
```

Результат:

```html
<button class='Button'>Click me</button>
```

### Создание элементов

[Элемент](https://ru.bem.info/methodology/quick-start/#Элемент) — составная часть блока, которая не может использоваться в отрыве от него. Чтобы создать элемент, необходимо импортировать класс [Elem](REFERENCE.md#elem) из библиотеки `bem-react-core`. Это базовый класс для создания экземпляров элементов.

Пример:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Block, Elem } from 'bem-react-core';

interface IButtonProps {
    children: string;
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
    document.getElementById('root')
);
```

Результат:

```html
<button class='Button'>
    <span class='Button-Text'>Click me</span>
</button>
```

### Создание модификаторов

[Модификаторы](https://ru.bem.info/methodology/quick-start/#Модификатор) определяют внешний вид, состояние или поведение блока либо элемента. Чтобы модифицировать блок или элемент, необходимо использовать [HOC](https://reactjs.org/docs/higher-order-components.html) функцию [withMods()](REFERENCE.md#withmods) из библиотеки `bem-react-core`. Функция `withMods()` получает в виде аргументов базовый блок/элемент со списком его модификаторов, возвращает — модифицированный блок либо элемент.

Пример:

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
// Создание элемента Text
class Text extends Elem {
    block = 'Button';
    elem = 'Text';

    tag() {
        return 'span';
    }
}
// Создание блока Button
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
// Расширение функциональности блока Button, при наличии свойства type со значением link

class ButtonLink extends Button<IModsProps> {
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
// Объединение классов Button и ButtonLink
const ButtonView = withMods(Button, ButtonLink);

ReactDOM.render(
    <React.Fragment>
        <ButtonView type='button'>Click me</ButtonView>
        <ButtonView type='link'>Click me</ButtonView>
    </React.Fragment>,
    document.getElementById('root')
);
```

Результат:

```html
<button type='button' class='Button Button_type_button'>
    <span class='Button-Text'>Click me</span>
</button>
<a type='link' href='www.yandex.ru' class='Button Button_type_link'>
    <span class='Button-Text'>Click me</span>
</a>
```

### Создание дополнительной HTML-разметки

Чтобы создать дополнительный HTML-элемент с именем CSS-класса сформированным по БЭМ-методологии, необходимо импортировать хелпер [Bem](REFERENCE.md#bem) из библиотеки `bem-react-core`.

> **Примечание.** Подробнее о [генерации CSS-классов](#Генерация-css-классов).

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
```

## Работа с CSS

### Генерация CSS-классов

Осуществляется с помощью полей [block](REFERENCE.md#block), [elem](REFERENCE.md#elem) и метода [mods()](REFERENCE.md#mods) в соответствии с [React-схемой именования](https://ru.bem.info/methodology/naming-convention/#Стиль-react) CSS-классов представленной ниже. Разделители имен блоков, элементов и модификаторов генерируются автоматически.

React-схема формирования имен CSS-классов:

`BlockName-ElemName_modName_modVal`

> **Примечание.** Подробнее о [схемах именования CSS-классов](https://ru.bem.info/methodology/naming-convention/).

Пример:

```tsx
// Создание блока
class Button extends Block {
    block = 'Button';
}

// Создание элемента
class Text extends Elem {
    block = 'Button';
    elem = 'Text';
}

// Создание модификатора блока
class Button extends Block {
    block = 'Button';

    mods() {
        return {
            theme: 'default'
        }
    }
}

// Создание модификатора элемента
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

Результат:

```html
<!-- Блок -->
<div class='Button'></div>

<!-- Элемент -->
<div class='Button-Text'></div>

<!-- Модификатор блока -->
<div class='Button Button_theme_default'></div>

<!-- Модификатор элемента -->
<div class='Button-Text Button-Text_theme_default'></div>
```

## Справочник API

Подробное описание API см. в [REFERENCE.md](REFERENCE.md).

## Руководство по переходу на API v2.0

Подробное руководство по переходу см. в [MIGRATION.md](MIGRATION.md).

## Версии API

API версионируется по [Semantic Versioning](https://semver.org). Рекомендуем использовать последнюю стабильную версию библиотеки.

> **Примечание.** История изменений API описана в [CHANGELOG.md](CHANGELOG.md). Руководства по переходу между различными версиями API см. в [MIGRATION.md](MIGRATION.md).

## Внести вклад

Bem React Core является библиотекой с открытым исходным кодом, которая находится в стадии активной разработки, а также используется внутри компании [Яндекс](https://yandex.ru/company/).

Если у вас есть предложения по улучшению API, вы можете прислать [Pull Request](https://github.com/bem/bem-react-core/pulls).

Если вы нашли ошибку, вы можете создать [issue](https://github.com/bem/bem-react-core/issues) с описанием проблемы.

Подробное руководство по внесению изменений см. в [CONTRIBUTING.md](CONTRIBUTING.md).

## Дополнительные материалы для изучения

### Видео
* [Мастер-класс по bem-react-core](https://www.youtube.com/watch?v=o1MeyEvpDTg&t)

## Лицензия

© 2018 [Яндекс](https://yandex.ru/company/). Код выпущен под [Mozilla Public License 2.0](LICENSE.txt).
