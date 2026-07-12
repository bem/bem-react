---
id: structure
title: Структура компонента
---

Обычно базовая структура компонента выглядит примерно так:

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

## Платформы

Если у компонента есть особенности, специфичные для платформы, — например, состояние при наведении, — создайте реализацию для этой платформы и реэкспортируйте всё из общей реализации.

Общая реализация:

```tsx
// src/components/Button/Button.tsx
import React from 'react'
import './Button.css'

export const Button = ({ children }) => <button className="Button">{children}</button>
```

Реализация для десктопа:

```tsx
// src/components/Button/Button@desktop.tsx
export * from './Button'
import './Button@desktop.css'
```

## Публичный API

Публичный API позволяет контролировать, что должно быть доступно разработчику, а также скрывает от потребителя, что для конкретной платформы часть кода может отсутствовать.

> Очень важно, чтобы в проекте был настроен [tree shaking](https://webpack.js.org/guides/tree-shaking/), иначе в итоговый бандл может попасть неиспользуемый код.

Пример:

```ts
// src/components/Button/desktop.ts
export * from './Button@desktop'
export * from './_view/Button_view_default'
export * from './hooks/useCheckedState'
```

Использование:

```ts
// src/components/Feature/Feature.tsx
import {
  Button as ButtonDesktop,
  withViewDefault,
  useCheckedState,
} from 'components/Button/desktop'
```
