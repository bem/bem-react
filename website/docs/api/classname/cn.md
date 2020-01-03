---
id: cn
title: cn
hide_title: true
---

# `cn`

Generate className for block or element with modifiers.

#### Arguments

1. `blockName` (string): Block name.
2. `elementName`? (string): Element name.

#### Returns

`ClassNameFormatter`

#### Examples

Generate className for block:

```ts
import { cn } from '@bem-react/classname'

const buttonCn = cn('Button')

buttonCn() // -> Button
buttonCn({ size: 'm' }) // Button Button_size_m
```

Generate className for element:

```ts
import { cn } from '@bem-react/classname'

const buttonCn = cn('Button')

buttonCn('Text') // -> Button-Text
buttonCn('Text', { size: 'm' }) // Button-Text Button-Text_size_m
```

Generate className for element (alternative):

```ts
import { cn } from '@bem-react/classname'

const buttonTextCn = cn('Button', 'Text')

buttonTextCn() // -> Button-Text
buttonTextCn({ size: 'm' }) // Button-Text Button-Text_size_m
```

Generate className with additional mixin (**all duplicates will be removed**):

```ts
import { cn } from '@bem-react/classname'

const buttonCn = cn('Button')

buttonCn(null, ['Header-Button']) // -> Button Header-Button
```
