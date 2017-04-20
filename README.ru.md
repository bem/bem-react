# BEM React Core

## Что это?

Библиотека для описания React-компонентов в виде деклараций БЭМ-сущностей.
Библиотека работает поверх обычных React-компонентов и предоставляет API для описания деклараций блоков, элементов и их модификаторов. Блоки и элементы созданные с помощью этой библиотеки полностью совместимы с любыми React-компонентами: могут использовать внутри себя готовые React-компоненты и могут быть использованы сами в коде на React.

## Зачем?

__Если вы используете [i-bem.js](https://ru.bem.info/platform/i-bem/)__
и хотите получить преимущества React-подхода, не потеряв привычные БЭМ-термины и декларативность.

__Если вы используете React__ и хотите получить преимущества [БЭМ-методологии](https://ru.bem.info/methodology/).


### Генерация CSS-классов

Сокращение синтаксического шума.

#### Было

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

#### Стало

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

__NB__ Альтернативно для генерации CSS-классов можно использовать библиотеки:
  * [b_](https://github.com/azproduction/b_)
  * [bem-cn](https://github.com/albburtsev/bem-cn)
  * [react-bem](https://github.com/cuzzo/react-bem)
  * [bem-classnames](https://github.com/pocotan001/bem-classnames)
  * [react-bem-helper](https://github.com/marcohamersma/react-bem-helper)
  * [dumb-bem](https://github.com/agudulin/dumb-bem)

## Декларативное доопределение по модификаторам

[Модификаторы](https://ru.bem.info/methodology/key-concepts/#Модификатор), это одно из ключевых понятий БЭМ-методологии, помогающее создавать вариации одного и того же компонента. `bem-react-core` позволяет удобно декларировать функциональность для модификаторов ([подробнее в документации](REFERENCE.ru.md#declmodpredicate-prototypeprops-staticprops)).

#### Было

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

Добавление модификаций требует добавления условий в основной код.
Можно было бы использовать создание наследуемых классов, но тогда затруднительно выражать несколько одновременно присутствующих модификаторов.

#### Стало

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

__NB__ Для создания деклараций используется библиотека [Inherit](https://github.com/dfilatov/inherit). В отличие от классов из ES2015, она позволяет создавать динамическое определение класса и модифицировать его. Также она предоставляет возможность делать «super» вызов (`this.__base(...arguments)`) без явного указания имени метода (`super.content(...arguments)`).

## Уровни переопределения

[Уровни переопределения](https://ru.bem.info/methodology/key-concepts/#Уровень-переопределения) — это инструмент БЭМ-методологии, который помогает разделять и переиспользовать код. Например разделять код для разных платформ. `bem-react-core` позволяет удобно декларировать React-компоненты на разных уровнях переопределения.

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

// decktop.blocks/Button/Button.js

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
```
 Сборку можно сконфигурировать так, что функциональность, описанная в `desktop.blocks` попадет только в сборку `common.blocks + desktop.blocks` для десктопных браузеров и не попадёт в сборку `common.blocks + touch.blocks` для мобильных.
 
## Блоки и элементы без декларации

Для удобного использования БЭМ-блоков и БЭМ-элементов без декларации JS-класса вы можете использовать в JSX `Bem` хелпер.

#### Было
```jsx
import React from 'react';

export default ({ size, theme, tabIndex }) => (
    <button className={`Button Button_size_${size} Button_theme_${theme}`} tabIndex={tabIndex}>
        <span className="Button-Text">Поехали!</span>
    </button>
);
```

#### Стыло
```jsx
import Bem from 'bem-react-core';

export default ({ size, theme }) => (
    <Bem block="Button" mods={{ size, theme }} tag="button" attrs={{ tabIndex }}>
        <Bem elem="Text">Поехали!</Bem>
    </Bem>
);
```

## Как использовать?

### Установка

> npm i -S bem-react-core

> yarn add bem-react-core

### Сборка

#### webpack

Используя [лоадер](https://github.com/bem/webpack-bem-loader) для webpack.

> npm i -D webpack-bem-loader babel-core

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
    techs : ['js', 'css'],
    levels : [
        `${__dirname}/common.blocks`,
        `${__dirname}/desktop.blocks`,
        // ...
    ]
}
// ...
```

#### Babel

Используя [плагин](https://github.com/bem/babel-plugin-bem-import) для Babel.

> npm i -D babel-plugin-bem-import

__.babelrc__
``` json
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

## Разработка

Получение исходников:

> git clone git://github.com/bem/bem-react-core.git
> cd bem-react-core

Установка зависимостей:

> npm i

Проверка кода:

> npm run lint

Запуск тестов:

> npm test

## Лицензия

© 2017 YANDEX LLC. Код лицензирован Mozilla Public License 2.0.
