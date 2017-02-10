# Документация

## Декларации

### `decl([base], prototypeProps, staticProps)`

- base `[{Object|Array}]` – базовый класс (блок или элемент) и/или массив миксинов
- prototypeProps `{Object}` – поля и методы экземпляра блока
- staticProps `{Object}` – cтатические поля и методы

### `declMod(predicate, prototypeProps, staticProps)`

- predicate `{Function}` – функция-матчер
- prototypeProps `{Object}` – поля и методы экземпляра блока
- staticProps `{Object}` – cтатические поля и методы

Декларация модификатора принимает первым аргументом функцию-матчер, которая возвращает значение булева типа. Функция-матчер в качестве аргумента принимает объект свойств (`this.props`) и может содержать любые условия. Если в процессе работы компонента функция-матчер возвращает положительный результат, то задекларированное будет использоваться.

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

### mix

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
