# core &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/core.svg)](https://www.npmjs.com/package/@bem-react/core) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/core.svg)](https://bundlephobia.com/result?p=@bem-react/core)

Core package helps organize and manage components with [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in React.

## Install

npm i -S @bem-react/core

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

In your `Components/Button/index.tsx`, you define the type of props your button can get (including all the modifiers) within the interface that extends **IClassNameProps** from '@bem-react/core' :
```ts
import { IClassNameProps } from '@bem-react/core'

export interface IButtonProps extends IClassNameProps {
  text: string;
}
```

#### Step 2.

Set up the **basic Button** variant which will be rendered if **no modifiers** props are set in the parent component.
Inside your `Components/Button/Button.tsx`:
```tsx
import React, { SFC } from 'react';
import { IButtonProps } from './index';

export const Button: SFC<IButtonProps> = ({ text, className }) => (
  <button className={className}>{text}</button>
);
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
import React from 'react';
import { withBemMod } from '@bem-react/core';
import { IButtonProps } from '../index';

export interface IButtonTypeLinkProps {
  type?: 'link';
}

export const withButtonTypeLink = withBemMod<IButtonTypeLinkProps, IButtonProps>('Button', { type: 'link' }, (Button) => (
  ({ text, className }) => (
    <a className={className}>{text}</a>
  )
));
```
**2.** In `Components/Button/_theme/Button_theme_action.tsx`
```tsx
import { withBemMod } from '@bem-react/core';

export interface IButtonThemeActionProps {
  theme?: 'action';
}

export const withButtonThemeAction = withBemMod<IButtonThemeActionProps>('Button', { theme:  'action' });
```
#### Step 4.
Back in your `Components/Button/index.tsx` you need to **compose** all the variants with the basic Button.
Be careful with the import order - it directly affects your CSS rules.
```tsx
import { compose } from '@bem-react/core';
import { Button as ButtonPresenter } from './Button';
import { withButtonTypeLink } from './_type/Button_type_link';
import { withButtonThemeAction } from './_theme/Button_theme_action';

export const Button = compose(
  withButtonThemeAction,
  withButtonTypeLink,
)(ButtonPresenter);
```
**Note!** The order of optional components composed onto ButtonPresenter is important: in case you have different layouts and need to apply several modifiers the **FIRST** one inside the compose method will be rendered!
E.g., here:
```tsx
export const Button = compose(
  withButtonThemeAction,
  withButtonTypeLink,
)(ButtonPresenter);
```
If your withButtonThemeAction was somewhat like

`<button className={className}>{text}</button>`

your JSX-component:

`<Button type="link" theme="action" text="Hello"/>`

would render into HTML:

`<button class="Button Button_theme_action Button_type_link">Hello</button>`

#### Step 5.
Finally, in your `App.tsx` you can use these options composed all together or partially:
```tsx
import React, { SFC } from 'react';
import Button from './Components/Button/Button';
import './App.css';

export const App: SFC = () => (
  <div className="App">
    <Button text="I'm basic" />
    // Renders into HTML as: <div class="Button">I'm Basic</div>

    <Button text="I'm type link" type="link" />
    // Renders into HTML as: <a class="Button Button_type_link">I'm type link</a>

    <Button text="I'm theme action" theme="action" />
    // Renders into HTML as: <div class="Button Button_theme_action">I'm theme action</div>

    <Button text="I'm all together" theme="action" type="link" />
    // Renders into HTML as: <a class="Button Button_theme_action Button_type_link">I'm all together</a>
  </div>
);
```

### Debug

To help your debug "@bem-react/core" support development mode.

For `<Button text="Hello" type="link" theme="action" />` (from the **Example** above), React DevTools will show:

```html
<WithBemMod(Button)[theme:action][enabled] ...>
  <WithBemMod(Button)[type:link][enabled] ...className="Button Button_theme_action">
    <a className="Button Button_type_link Button_theme_action">Hello</a>
  </WithBemMod(Button)[type:link][enabled]>
</WithBemMod(Button)[theme:action][enabled]>
```
