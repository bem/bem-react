# @bem-react/core &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/core.svg)](https://www.npmjs.com/package/@bem-react/core) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/core.svg)](https://bundlephobia.com/result?p=@bem-react/core)

Core package helps organize and manage components with [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in React.

## Install

```
npm i -S @bem-react/core
```

## Usage

Let's say, you have an initial App file structure as follows:

```
App.tsx
Components/
  Button/
    Button.tsx
```

And you need to set up two optional types of buttons that will be different from the `Button.tsx`. _(In our example those will be Button of theme 'action' and Button of type 'link')_

You can handle those using _@bem-react/core_.

Follow the guide.

#### Step 1.

In your `Components/Button/index.tsx`, you define the type of props your button can get within the interface that extends **IClassNameProps** from '@bem-react/core' :

```ts
import { ReactType } from 'react'
import { IClassNameProps } from '@bem-react/core'
import { cn } from '@bem-react/classname'

export interface IButtonProps extends IClassNameProps {
  as?: ReactType
}

export const cnButton = cn('Button')
```

#### Step 2.

Set up the **basic Button** variant which will be rendered if **no modifiers** props are set in the parent component.
Inside your `Components/Button/Button.tsx`:

```tsx
import React, { FC } from 'react'

import { IButtonProps, cnButton } from './index'

export const Button: FC<IButtonProps> = ({
  children,
  className,
  as: Component = 'button',
  ...props
}) => (
  <Component {...props} className={cnButton({}, [className])}>
    {children}
  </Component>
)
```

#### Step 3.

Set up the **optional withButtonTypeLink** and **optional withButtonThemeAction** variants that will be rendered if `{type: 'link'}` and/or `{theme: 'action'}` modifiers are set in the parent component respectively.
Inside your `Components/Button/` you add folders `_type/` with `Button_type_link.tsx` file in it and `_theme/` with `Button_theme_action.tsx` .

```
App.tsx
Components/
  Button/
    Button.tsx
    index.tsx
+   _type/
+     Button_type_link.tsx
+   _theme/
+     Button_theme_action.tsx
```

Set up the variants:

**Note!** The second parameter in `withBemMod()` is the condition for this component to be applied.

**1.** In `Components/Button/_type/Button_type_link.tsx`

```tsx
import React from 'react'
import { withBemMod } from '@bem-react/core'

import { IButtonProps, cnButton } from '../index'

export interface IButtonTypeLinkProps {
  type?: 'link'
  href?: string
}

export const withButtonTypeLink = withBemMod<IButtonTypeLinkProps, IButtonProps>(
  cnButton(),
  { type: 'link' },
  (Button) => (props) => <Button {...props} as="a" />,
)
```

**2.** In `Components/Button/_theme/Button_theme_action.tsx`

```tsx
import { withBemMod } from '@bem-react/core'

import { cnButton } from '../index'

export interface IButtonThemeActionProps {
  theme?: 'action'
}

export const withButtonThemeAction = withBemMod<IButtonThemeActionProps>(cnButton(), {
  theme: 'action',
})
```

#### Step 4.

Finally, in your `App.tsx` you need **compose** only necessary the variants with the basic Button.
Be careful with the import order - it directly affects your CSS rules.

> **NOTE:** If you wanna use same modifiers with different values you should use `composeU` for getting correctly typings.

```tsx
import React, { FC } from 'react';
import { compose, composeU } from '@bem-react/core';

import { Button as ButtonPresenter } from './Components/Button/Button';
import { withButtonTypeLink } from './Components/Button/_type/Button_type_link';
import { withButtonThemeAction } from './Components/Button/_theme/Button_theme_action';
import { withButtonThemeDefault } from './Components/Button/_theme/Button_theme_default';

import './App.css';

const Button = compose(
  composeU(withButtonThemeAction, withButtonThemeDefault),
  withButtonTypeLink,
)(ButtonPresenter);

export const App: FC = () => (
  <div className="App">
    <Button>I'm basic</Button>
    // Renders into HTML as: <button class="Button">I'm Basic</button>

    <Button type="link" href="#stub">I'm type link</Button>
    // Renders into HTML as: <a href="#stub" class="Button Button_type_link">I'm type link</a>

    <Button theme="action">I'm theme action</Button>
    // Renders into HTML as: <button class="Button Button_theme_action">I'm theme action</button>

    <Button theme="action" type="link">I'm all together</Button>
    // Renders into HTML as: <a class="Button Button_theme_action Button_type_link">I'm all together</a>
  </div>
);
```

**Note!** The order of optional components composed onto ButtonPresenter is important: in case you have different layouts and need to apply several modifiers the **FIRST** one inside the compose method will be rendered!
E.g., here:

```tsx
export const Button = compose(
  withButtonThemeAction,
  withButtonTypeLink,
)(ButtonPresenter)
```

If your withButtonThemeAction was somewhat like

`<button className={className}>{children}</button>`

your JSX-component:

`<Button type="link" theme="action">Hello</Button>`

would render into HTML:

`<a class="Button Button_theme_action Button_type_link">Hello</a>`

## Use reexports for better DX

> **IMPORTANT:** use this solution if [tree shaking](https://webpack.js.org/guides/tree-shaking/) enabled

Example:

```
Block/Block.tsx
Block/Block@desktop.tsx
Block/_mod/Block_mod_val1.tsx
Block/_mod/Block_mod_val2.tsx
Block/_mod/Block_mod_val3.tsx
```

Create reexports for all modifers in intex files by platform: desktop, phone, amp, etc.

```ts
// Block/index.ts
export * from './Block'
export * from './Block/_mod'

// Block/desktop.ts
export * from './Block@desktop'
export * from './Block/_mod'

// Block/phone.ts
export * from './' // for feature if not created platform version

// Block/_mod/index.ts
export * from './Block_mod_val1.tsx'
export * from './Block_mod_val2.tsx'
export * from './Block_mod_val3.tsx'
```

Usage:

```ts
// App.tsx
import { Block as BlockPresenter, withModVal1 } from './components/Block/desktop'

const Block = withModVal1(BlockPresenter)
```

## Optimization. Lazy load for modifiers.

Solution for better code spliting with React.lazy and dynamic imports

> **NOTE** If your need SSR replace React.lazy method for load `Block_mod.async.tsx` module to [@loadable/components](https://www.smooth-code.com/open-source/loadable-components/) or [react-loadable](https://github.com/jamiebuilds/react-loadable)

```tsx
// Block/_mod/Block_mod.async.tsx
import React from 'react'
import { cnBlock } from '../Block'

import './Block_mod.css'

export const DynamicPart: React.FC = () => <i className={cnBlock('Inner')}>Loaded dynamicly</i>

// defualt export needed for React.lazy
export default DynamicPart
```

```tsx
// Block/_mod/Block_mod.tsx
import React, { Suspense, lazy } from 'react'
import { cnBlock } from '../Block'

export interface BlockModProps {
  mod?: boolean
}

export const withMod = withBemMod<BlockModProps>(cnBlock(), { mod: true }, (Block) => (props) => {
  const DynamicPart = lazy(() => import('./Block_mod.async.tsx'))

  return (
    <Suspense fallback={<div>Updating...</div>}>
      <Block {...props}>
        <DynamicPart />
      </Block>
    </Suspense>
  )
})
```

Usage:

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
    );
}
```

## Simple modifiers (only CSS classes)

In most cases you need change only CSS class. This mode doesn't pass modififer value to props.
It doesn't create React wrappers for component, that's way more optimal.

```tsx
import React from 'react'
import { cnBlock } from '../Block'

export interface BlockModProps {
  simplemod?: boolean
}

export const withSimpleMod = createClassNameModifier<BlockModProps>(cnBlock(), { simplemod: true })
```

## Debug

To help your debug "@bem-react/core" support development mode.

For `<Button type="link" theme="action">Hello</Button>` (from the **Example** above), React DevTools will show:

```html
<WithBemMod(Button)[theme:action] ...>
  <WithBemMod(Button)[type:link] className="Button Button_theme_action" ...>
    <a className="Button Button_type_link Button_theme_action">Hello</a>
  </WithBemMod(Button)[type:link]>
</WithBemMod(Button)[theme:action]>
```
