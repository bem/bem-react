---
id: structure
title: Component structure
---

In common cases the basic structure of the component looks something like this:

```
src/components/Button/
├── Button.css
├── Button.tsx
├── Button@desktop.css
├── Button@desktop.tsx
├── desktop.ts
├── _view
│   ├── Button_view_default.css
│   └── Button_view_default.tsx
└── hooks
    └── useCheckedState.ts
```

## Platforms

If a component has some platform-specific features, such as hover state, then you need to create an implementation for that platform and reexport all from common.

Common implementation:

```tsx
// src/components/Button/Button.tsx
import React from 'react'
import './Button.css'

export const Button = ({ children }) => <button className="Button">{children}</button>
```

Desktop implementation:

```tsx
// src/components/Button/Button@desktop.tsx
export * from './Button'
import './Button@desktop.css'
```

## Public API

The public API allows you to control what should be available to the developer, and also encapsulates the logic about the absence of any code for a particular platform.

> Very important that the project was configured with [tree shaking](https://webpack.js.org/guides/tree-shaking/), otherwise in result bundle may be unused code.

Example:

```ts
// src/components/Button/desktop.ts
export * from './Button@desktop'
export * from './_view/Button_view_default'
export * from './hooks/useCheckedState'
```

Usage:

```ts
// src/components/Feature/Feature.tsx
import {
  Button as ButtonDesktop,
  withViewDefault,
  useCheckedState,
} from 'components/Button/desktop'
```
