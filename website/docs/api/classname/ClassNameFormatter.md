---
id: ClassNameFormatter
title: ClassNameFormatter
hide_title: true
---

# `ClassNameFormatter`

```ts
type ClassNameList = Array<string | undefined>
type NoStrictEntityMods = Record<string, string | boolean | number | undefined>

type ClassNameFormatter = (
  elementNameOrBlockModifiers?: NoStrictEntityMods | string | null,
  elementModifiersOrBlockMixins?: NoStrictEntityMods | ClassNameList | null,
  elementMixins?: ClassNameList,
) => string
```
