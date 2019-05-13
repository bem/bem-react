---
id: classname
title: Нейминг
---

Для построения классов в разметке используется пакет `@bem-react/classname`.

## Стандартный нейминг

<!-- TODO: cn должна вести на ref-api -->
<!-- TODO: мб все в одном блоке сделать -->

Подключаем библиотеку и вызываем функцию `cn` для построения класса блока:

```js
const cnButton = cn('Button')
```

#### Получить класс для блока:

```js
cnButton() // Button
```

#### Получить класс для блока с модификатором:

```js
cnButton({ size: 'medium' }) // Button Button_size_medium
```

#### Получить класс для блока с дополнительным классом:

```js
cnButton({}, ['Widget-Button']) // Button Widget-Button
```

Чтобы получить класс для элмента блока, то нужно в качестве второго аргумента передать строку, все остальное работает точно так же как и с блоком:

```js
cnButton('Text') // Button-Text
cnButton('Text', { type: 'short' }) // Button-Text Button-Text_type_short
cnButton('Text', {}, ['Widget-Button-Text']) // Button-Text Widget-Button-Text
```

## Пользовательский нейминг

По умолчанию `@bem-react/classname` использует `React` пресет для формирования классов, но при необходимости можно сконфигурировать функцию `cn` со своим пресетом, для этого используется функция `withNaming`.

```js
const cn = withNaming({ n: 'ns-', e: '__', m: '_', v: '_' })
const cnButton = cn('button')
```

<!-- TODO: возможно стоит дополнить примеры и разбить на логические блоки -->

Пример с получением класса для блока:

```js
cnButton() // button
cnButton({ size: 'medium' }) // button_size_medium
cnButton('text') // button__text
```

## Дополнительно

Если есть необходимость отфильтровать дубликаты классов, то есть функция `classnames` из пакета `@bem-react/classnames`.

Пример фильтрации:

```js
classnames('Button', 'Button', 'Widget-Button') // Button Widget-Button
```


<!-- TODO: полезные ссылки. для чего вообще нужны классы (можно написать про то, что название класса с 99% матчится на файловую систему и файл легко найти) -->
