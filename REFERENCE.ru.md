# Документация

## Декларации

### `decl([base ,] prototypeProps[, staticProps, wrapper])`

- base `[{Object|Array}]` – базовый класс (блок или элемент) и/или массив миксинов
- prototypeProps `{Object}` – поля и методы экземпляра блока
- staticProps `{Object}` – статические поля и методы
- wrapper `{Function}` - произвольная функция-обертка для использования [HOC](https://facebook.github.io/react/docs/higher-order-components.html).
Вы можете использовать эту функцию для оборачивания компонентов, так как `decl` не возвращает React-компонент.
Эта функция будет вызвана после того как все декларации применятся и будет создан React-компонент.


### `declMod(predicate, prototypeProps[, staticProps])`

- predicate `{Object|Function}` – объект-матчер для модификатора или произвольная функция-матчер
- prototypeProps `{Object}` – поля и методы экземпляра блока
- staticProps `{Object}` – статические поля и методы

Если вы используете объект-матчер для модификатора в качестве первого аргумента,
то поле `mods` будет установлено автоматически.
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

Декларация модификатора может принимать первым аргументом произвольную функцию-матчер, которая возвращает значение булева типа. 
Функция-матчер в качестве аргумента принимает объект свойств (`this.props`) и может содержать любые условия. 
Если в процессе работы компонента функция-матчер возвращает положительный результат, то задекларированное будет использоваться.
Если в этом случае вам нужны CSS-классы для модификаторов, то вам придется явно декларировать поле `mods`.

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

## Стандартные поля и методы деклараций

Все методы деклараций принимают в качестве аргумента объект свойств (`this.props`). Исключение составляют методы [`wrap`](#wrap) и [`content`](#content).

### block

Имя блока. Используется в построении CSS-класса компонента.

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

Имя элемента блока. Используется в построении CSS-класса компонента.

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

HTML-тэг компонента. По умолчанию `div`.

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

HTML-атрибуты и React-биндинги компонента.

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

Дополнительные CSS-классы.

Из JSX:
``` jsx
<MyBlock cls="custom-class"/>
```
``` html
<div class="MyBlock custom-class"></div>
```

Из декларации:
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

Модификаторы блока или элемента. Весь список ключей возвращаемого объекта будет транслирован в соответствующие CSS-классы компонента.

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

### mix, addMix

[БЭМ-миксы](https://ru.bem.info/methodology/key-concepts/#Микс).

Из JSX:
``` jsx
<MyBlock mix={{ block : 'MixedBlock' }}/>
<MyBlock mix={[{ block : 'MixedBlock' }, { block : 'MixedBlock2', elem : 'MixedElem2' }]}/>
```
``` html
<div class="MyBlock MixedBlock"></div>
<div class="MyBlock MixedBlock MixedBlock2-MixedElem2"></div>
```

Из декларации:
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

Из декларации и из JSX:
``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    addMix({ mixedElem }) {
        return { block : 'MixedBlock2', elem : mixedElem };
    }
});
```
``` jsx
<MyBlock mixedElem="MixedElem2" mix={{ block : 'MixedBlock' }}/>
```
``` html
<div class="MyBlock MixedBlock2-MixedElem2 MixedBlock"></div>
```

### content

Содержимое компонента. Принимает первым аргументом объект свойств (`this.props`), а вторым поле `this.props.children`. Возвращаемое значение может быть: строкой, React-компонентом, массивом строк и/или React-компонентов.

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

Специальный метод, позволяющий обернуть компонент в другой компонент, DOM-узел или любое другое более сложное их сочетание. Принимает первым аргументом экземпляр текущего React-компонента.

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

## Методы жизненного цикла

Использьзуются [стандартные методы жиненного цикла](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle) React-компонента. Из имён сокращено слово `component`. Так же как и остальные, методы жизненного цикла могут быть доопределены по модификатору и на других уровнях.

``` js
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    willInit() {
        // оригинальное имя: constructor
    },
    willMount() {
        // оригинальное имя: componentWillMount
    },
    didMount() {
        // оригинальное имя: componentDidMount
    },
    willReceiveProps() {
        // оригинальное имя: componentWillReceiveProps
    },
    shouldUpdate() {
        // оригинальное имя: shouldComponentUpdate
    },
    willUpdate() {
        // оригинальное имя: componentWillUpdate
    },
    didUpdate() {
        // оригинальное имя: componentDidUpdate
    },
    willUnmount() {
        // оригинальное имя: componentWillUnmount
    },
    render() {
        // перезаписывает весь узел целиком, 
        // при его использовании игнорируется генерация классов, стандартные поля и методы декларации
    }
});
```

## Свойства класса

Декларируются в статических полях.

``` js
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
