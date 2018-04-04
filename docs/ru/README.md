# BEM React Core [![Build Status](https://travis-ci.org/bem/bem-react-core.svg?branch=master)](https://travis-ci.org/bem/bem-react-core) [![GitHub Release](https://img.shields.io/github/release/bem/bem-react-core.svg)](https://github.com/bem/bem-react-core/releases) [![devDependency Status](https://david-dm.org/bem/bem-react-core/dev-status.svg)](https://david-dm.org/bem/bem-react-core#info=devDependencies)

## Что это?

Библиотека для описания React-компонентов в виде деклараций [БЭМ-сущностей](https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность).
Библиотека работает поверх обычных React-компонентов и предоставляет [API](RFERENCE.md) для описания деклараций блоков, элементов и модификаторов. Блоки и элементы, созданные с помощью bem-react-core, полностью совместимы с обычными React-компонентами и могут использоваться в одном проекте.

## Зачем?

**Если вы используете [методологию БЭМ](https://ru.bem.info/methodology/)** и хотите получить функциональность фреймворка [i-bem.js](https://ru.bem.info/platform/i-bem/) и шаблонизатора в одной легковесной библиотеке.

**Если вы используете React** и хотите получить преимущества БЭМ-методологии: [уровни переопределения](https://ru.bem.info/methodology/redefinition-levels/), [декларативность](https://ru.bem.info/methodology/declarations/), [миксы](https://ru.bem.info/methodology/key-concepts/#Микс) и возможность точечной [сборки](https://ru.bem.info/methodology/build/) проекта. 

> Чтобы лучше объяснить [мотивацию](./Introduction/Motivation.md) создания библиотеки bem-react-core, мы описали известные узкие места в React-подходе и программировании в целом, которые решает связка БЭМ и React.

## Документация

Документация опубликована на [GitBook](https://bem.gitbooks.io/bem-react-core/ru/).

Основные разделы: // наполнить разделы
* Начало работы с bem-react-core
* Референс
* Quick Start
* Advanced Guides
* Tutorial
* Where to Get Support
* Contributing Guide
* FAQ

## Возможности библиотеки

Библиотека расширяет возможности разработки классического React-подхода и позволяет: 

* [Генерировать CSS-классы](#Генерация-css-классов)
* [Доопределять компоненты по модификаторам](#Декларативное-доопределение-компонента-по-модификаторам)
* [Использовать уровни переопределения](#Уровни-переопределения)
* [Использовать блоки и компоненты без декларации](#Блоки-и-элементы-без-декларации)

Примеры для наглядности рассмотрены в сравнении с классическим кодом React-компонентов.

### Генерация CSS-классов

Декларативное описание компонента сокращает синтаксический шум.

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

### Декларативное доопределение компонента по модификаторам

В классическом React-подходе, чтобы модифицировать компонент, необходимо добавить условия в основной код этого компонента. Чем разнообразнее модификация, тем больше и сложнее условия. Чтобы избежать сложных условий в коде, используются [наследуемые классы](./Introduction/Motivation.md#Повторное-использование-кода) или High Order Components. Оба способа имеют свои [ограничения](./Introduction/Motivation.md#Повторное-использование-кода).

В `bem-react-core` состояния и внешний вид универсальных компонентов изменяются с помощью [модификаторов](https://ru.bem.info/methodology/key-concepts/#Модификатор). Функциональность модификаторов декларируется в отдельных файлах. Одному компоненту можно задать неограниченное количество модификаторов. Чтобы модифицировать компонент, достаточно указать модификатор и его значение в декларации.

Декларативное доопределение компонента по модификаторам позволяет:
* отказаться от цепочек условий с `if` или `switch` в методе `render()`, которые не позволяют гибко изменять компонент;
* подключать в сборку только нужные модификаторы;
* создавать неограниченное количество модификаторов, не перегружая основной код компонента;
* комбинировать несколько модификаторов на одном компоненте для каждого конкретного случая.

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

> Для создания деклараций используется библиотека [Inherit](https://github.com/dfilatov/inherit). В отличие от классов из ES2015, она позволяет создавать динамическое определение класса и модифицировать его. Также она предоставляет возможность делать «super» вызов (`this.__base(...arguments)`) без явного указания имени метода (`super.content(...arguments)`).

### Уровни переопределения

[Уровни переопределения](https://ru.bem.info/methodology/key-concepts/#Уровень-переопределения) — это инструмент БЭМ-методологии, который помогает разделять и повторно использовать код.

`bem-react-core` позволяет декларировать React-компоненты на разных уровнях переопределения. 

> [Примеры использования уровней переопределения](https://ru.bem.info/methodology/redefinition-levels/#Примеры-использования-уровней-переопределения)

В примере ниже рассмотрен случай разделения кода по платформам. Часть кода описывает общую функциональность (`common.blocks`) и часть — специфичную для платформ (`desktop.blocks` и `touch.blocks`):

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
    ...
});

```

Разделение кода по отдельным уровням переопределения позволяют настроить сборку так, чтобы функциональность компонентов из `desktop.blocks` попадала только в сборку для настольных браузеров (`common.blocks + desktop.blocks`) и не подключалась в сборку для мобильных устройств (`common.blocks + touch.blocks`). 

Уровни переопределения дают возможность иметь одновременно разные сборки одного проекта и предоставлять необходимый вариант в зависимости от юзер-агента. 

### Блоки и элементы без декларации

bem-react-core позволяет создавать блоки и элементы без декларации, если необходимо сгенерировать дополнительную HTML-разметку.

Чтобы записать блоки и элементы БЭМ без декларации JavaScript-класса, используется `Bem`-хелпер.

#### React.js

```jsx
import React from 'react';

export default ({ size, theme, tabIndex }) => (
    <button className={`Button Button_size_${size} Button_theme_${theme}`} tabIndex={tabIndex}>
        <span className="Button-Text">Поехали!</span>
    </button>
);
```

#### BEM React Core

```jsx
import Bem from 'bem-react-core';

export default ({ size, theme }) => (
    <Bem block="Button" mods={{ size, theme }} tag="button" attrs={{ tabIndex }}>
        <Bem elem="Text">Поехали!</Bem>
    </Bem>
);
```

## Использование

Библиотеку bem-react-core можно использовать разными способами:
* Библиотека доступна в виде [пакета в npm или Yarn](#Установка). 
* Предсобранные файлы библиотеки можно [подключить с CDN](#cdn).

### Установка

Воспользуйтесь менеджером пакетов [npm](https://www.npmjs.com/) или [Yarn](https://yarnpkg.com/lang/en/).

Рекомендуемый способ установки bem-react-core зависит от вашего проекта. Ниже представлены краткие руководства по наиболее распространенным сценариям:

* Создать новое приложение на bem-react-core
* Установить библиотеку в существующий проект

#### npm

```
npm i -S bem-react-core
```

#### Yarn

```
yarn add bem-react-core
```

### CDN

Скопируйте ссылки на предсобранные файлы библиотеки в HTML страницы:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/prop-types/prop-types.min.js"></script>
<script src="https://unpkg.com/bem-react-core@1.0.0-rc.8/umd/react.js"></script>
```

> [Подключение bem-react-core с CDN](./UseCDNLinks.md)

### Сборка

#### webpack

Используйте [лоадер](https://github.com/bem/webpack-bem-loader) для webpack.

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
    techs : ['js', 'css'],  // Технологии, которые используются для реализации компонентов
    levels : [              // Уровни, которые используются в проекте
        `${__dirname}/common.blocks`,
        `${__dirname}/desktop.blocks`,
        // ...
    ]
}
// ...
```

> [Как использовать webpack для сборки БЭМ-проектов на bem-react-core](https://events.yandex.ru/lib/talks/5131/) (видео)

#### Babel

Используйте [плагин](https://github.com/bem/babel-plugin-bem-import) для Babel.

```
npm i -D babel-plugin-bem-import
```

__.babelrc__
``` json
{
  "plugins" : [
    ["bem-import", {
      "levels" : [              // Уровни, которые используются в проекте
        "./common.blocks",
        "./desktop.blocks"
      ],
      "techs" : ["js", "css"]   // Технологии, которые используются для реализации компонентов
    }]
  ]
}
```

## Разработка

Получение исходников:

```
git clone git://github.com/bem/bem-react-core.git
cd bem-react-core
```

Установка зависимостей:

```
npm i
```

Проверка кода:

```
npm run lint
```

Запуск тестов:

```
npm test
```

> [Как внести изменения в проект?](../../../CONTRIBUTING.ru.md)

## Дополнительные материалы для изучения

### Видео
* [Мастер-класс по bem-react-core](https://www.youtube.com/watch?v=o1MeyEvpDTg&t)

### Альтернативные библиотеки для генерации CSS-классов:
  * [b_](https://github.com/azproduction/b_)
  * [bem-cn](https://github.com/albburtsev/bem-cn)
  * [react-bem](https://github.com/cuzzo/react-bem)
  * [bem-classnames](https://github.com/pocotan001/bem-classnames)
  * [react-bem-helper](https://github.com/marcohamersma/react-bem-helper)
  * [dumb-bem](https://github.com/agudulin/dumb-bem)

## Лицензия

© 2017 YANDEX LLC. Код лицензирован Mozilla Public License 2.0.
