---
id: classnames
title: classnames
---

Merge all unique strings into string.

```ts
/**
 * @param strings ClassNames strings.
 * @return Merged string.
 */
function classnames(...strings: Array<string | undefined>): string
```

#### Examples

```ts
import { classnames } from '@bem-react/classnames'

classnames('Block', 'Mix', undefined, 'Block') // 'Block Mix'
```
