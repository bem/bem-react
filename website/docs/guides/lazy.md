---
id: lazy
title: Lazy modifiers
---

Solution for better code spliting with React.lazy and dynamic imports

## Structure

```
src/components/Block/
├── Block.tsx
├── _mod
│   └── Button_mod.async.tsx
│   └── Button_mod.css
│   └── Button_mod.tsx
```

## Declaration

**Step 1.** Declare the part of the code that should be loaded dynamically.

```tsx
// Block/_mod/Block_mod.async.tsx
import React from 'react'
import { cnBlock } from '../Block'

import './Block_mod.css'

export const DynamicPart: React.FC = () => <i className={cnBlock('Inner')}>Loaded dynamicly</i>

// defualt export needed for React.lazy
export default DynamicPart
```

**Step 2.** Declare the modifier.

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

> **NOTE** If your need SSR replace React.lazy method for load `Block_mod.async.tsx` module to [@loadable/components](https://www.smooth-code.com/open-source/loadable-components/) or [react-loadable](https://github.com/jamiebuilds/react-loadable)

## Usage

```ts
// App.tsx
import {
  Block as BlockPresenter,
  withMod
} from './components/Block/desktop';

const Block = withMod(BlockPresenter);

export const App = () => {
  return (
    {/* chunk with DynamicPart not loaded */}
    <Block />

    {/* chunk with DynamicPart loaded */}
    <Block mod />
  )
}
```
