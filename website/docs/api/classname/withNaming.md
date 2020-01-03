---
id: withNaming
title: withNaming
hide_title: true
---

# `withNaming`

Creates a new `ClassNameInitilizer` with passed [preset](Preset).

#### Arguments

1. `preset` (Preset): Shape with naming preset.

#### Returns

`ClassNameInitilizer`

#### Examples

React naming preset:

```ts
import { withNaming } from '@bem-react/classname'

const preset = { e: '-', m: '_' }
const cn = withNaming(preset)

cn('Block', 'Elem')({ theme: 'default' }) // -> Block-Elem_theme_default
```

Origin naming preset:

```ts
import { withNaming } from '@bem-react/classname'

const preset = { e: '__', m: '_', v: '_' }
const cn = withNaming(preset)

cn('block', 'elem')({ theme: 'default' }) // -> block__elem_theme_default
```
