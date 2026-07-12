---
id: lazy
title: Ленивые модификаторы
---

Более эффективное разделение кода с помощью React.lazy и динамических импортов.

## Структура

```
src/components/Block/
├── Block.tsx
├── _mod
│   └── Button_mod.async.tsx
│   └── Button_mod.css
│   └── Button_mod.tsx
```

## Объявление

**Шаг 1.** Объявите часть кода, которая должна загружаться динамически.

```tsx
// Block/_mod/Block_mod.async.tsx
import React from 'react'
import { cnBlock } from '../Block'

import './Block_mod.css'

export const DynamicPart: React.FC = () => <i className={cnBlock('Inner')}>Loaded dynamicly</i>

// default export нужен для React.lazy
export default DynamicPart
```

**Шаг 2.** Объявите модификатор.

```tsx
// Block/_mod/Block_mod.tsx
import React, { Suspense, lazy } from 'react'
import { cnBlock } from '../Block'

export interface BlockModProps {
  mod?: boolean
}

export const withMod = withBemMod<BlockModProps>(
  cnBlock(),
  {
    mod: true,
  },
  (Block) => (props) => {
    const DynamicPart = lazy(() => import('./Block_mod.async.tsx'))

    return (
      <Suspense fallback={<div>Updating...</div>}>
        <Block {...props}>
          <DynamicPart />
        </Block>
      </Suspense>
    )
  },
)
```

> **Примечание.** Если вам нужен SSR, для загрузки модуля `Block_mod.async.tsx` используйте вместо React.lazy [@loadable/component](https://www.smooth-code.com/open-source/loadable-components/) или [react-loadable](https://github.com/jamiebuilds/react-loadable).

## Использование

```ts
// App.tsx
import {
  Block as BlockPresenter,
  withMod
} from './components/Block/desktop';

const Block = withMod(BlockPresenter);

export const App = () => {
  return (
    {/* чанк с DynamicPart не загружен */}
    <Block />

    {/* чанк с DynamicPart загружен */}
    <Block mod />
  )
}
```
