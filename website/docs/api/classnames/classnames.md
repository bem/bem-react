---
id: classnames
title: classnames
hide_title: true
---

# `classnames`

Generate className string with unique tokens.

#### Arguments

1. `...tokens` (Array<string | undefined>): ClassName tokens.

#### Returns

`(string)`

#### Examples

Remove all duplicates or undefined values:

```ts
import { classnames } from '@bem-react/classnames'

classnames('Button', 'Button', 'Header-Button', undefined) // -> Button Header-Button
```
