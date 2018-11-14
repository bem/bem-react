# core &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/core.svg)](https://www.npmjs.com/package/@bem-react/core) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/core.svg)](https://bundlephobia.com/result?p=@bem-react/core)

Tiny helper for [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in React.

## Install

```
npm i -S @bem-react/core
```

## Example

Component folder structure:

```
components/
    Button/
        _theme/
            Button_theme_action.tsx
            Button_theme_action.css *
        _type/
            Button_type_link.tsx
            Button_type_link.css *
        index.tsx
        Button.tsx
        Button.css *



```
&#42; Optional files

### Button index:
`components/Button/index.tsx`

```tsx
// Button index
// components/Button/index.tsx

import { compose, IClassNameProps } from '@bem-react/core';

import { Button as Base } from './Button';
import { ButtonTypeLink } from './_type/Button_type_link';
import { ButtonThemeAction } from './_theme/Button_theme_action';

export interface IButtonProps extends IClassNameProps {
text: string;

// list of all modifiers
type?: 'link';
theme?: 'action';
}

// composition of all variations
// JSX → <Button text="Hello" type="link" theme="action" /> gives
// HTML → <a class="Button Button_type_link Button_theme_action">Hello</a>
export const Button = compose(
ButtonThemeAction,
ButtonTypeLink
)(Base);
```

### Button (“as-is”, without any modifications):
`components/Button/Button.tsx`

```tsx
// Button as is
// components/Button/Button.tsx

import * as React from 'react';
import { IButtonProps } from './index';

// optional
// import './Button.css';

export const Button: React.SFC<IButtonProps> = ({ text, className }) => (
<div className={className}>{text}</div>
);
```

### Button looking as a link:
`components/Button/_type/Button_type_link.tsx`
   
```tsx
// Button looking as a link
// components/Button/_type/Button_type_link.tsx

import * as React from 'react';
import { withBemMod, ModBody } from '@bem-react/core';
import { IButtonProps } from '../index';

// optional
// import './Button_type_link.css';

const ButtonLink: ModBody<IButtonProps> = (Base, { text, className }) => (
// className === 'Button Button_type_link'
<a className={className}>{text}</a>
);

// should be read like:
//   if props.type === 'link' → return ButtonLinkBody(...)
//   else → return Base
export const ButtonTypeLink = withBemMod<IButtonProps>('Button', { type: 'link' }, ButtonLink);
```

### Button for actions (has different styles):
`components/Button/_theme/Button_theme_action.tsx`

```tsx
// Button for actions (has different styles)
// components/Button/_theme/Button_theme_action.tsx

import { withBemMod } from '@bem-react/core';
import { IButtonProps } from '../index';

// optional
// import './Button_theme_action.css';

// should be read like:
//   if props.theme === 'action' → return <Base className="Button Button_theme_action ...
//   else → return Base
export const ButtonThemeAction = withBemMod<IButtonProps>('Button', { theme: 'action' });
```

## Debug

To help your debug "@bem-react/core" support development mode.

For `<Button text="Hello" type="link" theme="action" />` (from **Example** above) React DevTools will show:

```html
<WithBemMod(Button)[theme:action][enabled] ...>
    <WithBemMod(Button)[type:link][enabled] ... className="Button Button_theme_action">
        <a className="Button Button_type_link Button_theme_action">Hello</a>
    </WithBemMod(Button)[type:link][enabled]>
</WithBemMod(Button)[theme:action][enabled]>
```
