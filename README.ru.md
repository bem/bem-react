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

export default class MyBlock extends React.Component {
    render() {
        const { myMod1, myMod2, children } = this.props;
        return (
            <div className={`MyBlock MyBlock_myMod1_${myMod1} MyBlock_myMod2_${myMod2}`}>
                {children}
            </div>
        );
    }
};
```

#### Стало

```jsx
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mods({ myMod1, myMod2 }) {
        return { myMod1, myMod2 };
    }
});

```

__NB__ Альтернативно для генерации CSS-классов можно использовать библиотеки:
  * [b_](https://github.com/azproduction/b_)
  * [bem-cn](https://github.com/albburtsev/bem-cn)
  * [react-bem](https://github.com/cuzzo/react-bem)
  * [bem-classnames](https://github.com/pocotan001/bem-classnames)
  * [react-bem-helper](https://github.com/marcohamersma/react-bem-helper)

## Декларативное доопределение по модификаторам

[Модификаторы](https://ru.bem.info/methodology/key-concepts/#Модификатор), это одно из ключевых понятий БЭМ-методологии, помогающее создавать вариации одного и того же компонента. `bem-react-core` позволяет удобно декларировать функциональность для модификаторов ([подробнее в документации](REFERENCE.ru.md#declmodpredicate-prototypeprops-staticprops)).

#### Было

```jsx
import React from 'react';

export default class MyBlock extends React.Component {
    render() {
        const { myMod1, myMod2, children } = this.props;
        let className = 'MyBlock',
            content = [children];

        if(myMod1 === 'myVal1') {
            className += `MyBlock_myMod1_${myMod1}`;
            content.unshift('Modification for myMod1 with value myVal1.');
        }

        if(myMod2 === 'myVal2') {
            className += `MyBlock_myMod1_${myMod2}`;
            content.unshift('Modification for myMod2 with value myVal2.');
        }

        return (
            <div className={className}>
                {content}
            </div>
        );
    }
};
```

Добавление модификаций требует добавления условий в основной код.
Можно было бы использовать создание наследуемых классов, но тогда затруднительно выражать несколько одновременно присутствующих модификаторов.

#### Стало

```jsx
// MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    mods({ myMod1, myMod2 }) {
        return { myMod1, myMod2 };
    }
});

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

// MyBlock_myMod2_myVal2.js

import { declMod } from 'bem-react-core';

export default declMod({ myMod2 : 'myVal2' }, {
    block : 'MyBlock',
    content() {
        return [
            'Modification for myMod2 with value myVal2.',
            this.__base(...arguments)
        ];
    }
});
```

__NB__ Для создания JS-классов используется библиотека [Inherit](https://github.com/dfilatov/inherit) с возможностью делать «super» вызов (`this.__base(...arguments)`) без указания имени метода (`super.content.apply(this, arguments)`).

## Уровни переопределения

[Уровни переопределения](https://ru.bem.info/methodology/key-concepts/#Уровень-переопределения) – это инструмент БЭМ-методологии, который помогает разделять и переиспользовать код. Например разделять код для разных платформ. `bem-react-core` позволяет удобно декларировать React-компоненты на разных уровнях переопределения.

```jsx
// common.blocks/MyBlock/MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    tag : 'a',
    attrs({ url }) {
        return { href : url };
    }
});

// decktop.blocks/MyBlock/MyBlock.js

import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    willInit() {
        this.state = {};
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    },
    mods() {
        return { hovered : this.state.hovered };
    }
    attrs({ url }) {
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
