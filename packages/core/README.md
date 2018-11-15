# core &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/core.svg)](https://www.npmjs.com/package/@bem-react/core) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/core.svg)](https://bundlephobia.com/result?p=@bem-react/core)

Helps organize and manage components used with [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in React.

## Install

`npm i -S @bem-react/core`

## How to use `bem-react/core`

Let's say, you have an initial App file structure as follows:

```
App.tsx
Components/
  Button/
    Button.tsx
    index.tsx
```

And you need to set up two optional types of buttons that will be different from the `Button.tsx`. _(In our example those will be Button of theme 'action' and Button of type 'link')_

You can handle those using _bem-react/core_.

Follow the guide.

#### Step 1.

In your `Components/Button/index.tsx`, you define the type of props your button can get (including all the modifiers) within the interface that extends **IClassNameProps** from '@bem-react/core' :

```
import { IClassNameProps } from '@bem-react/core'

export interface IButtonProps extends IClassNameProps {
  text: string;
  className: string;

  // the following is the list of all modifiers:

  type?: 'link';
  theme?: 'action';
}
```

#### Step 2.

Set up the **basic Button** variant which will be rendered if **no modifiers** props are set in the parent component.
Inside your `Components/Button/Button.tsx`:

```
import * as React from 'react';
import { IButtonProps } from './index';

export const Button: React.SFC<IButtonProps> = ({ text, className }) => ( 
  <div className={className}>{text}</div>
);
```

#### Step 3.

Set up the **optional ButtonTypeLink** and **optional ButtonThemeAction** variants that will be rendered if `{type: 'link'}` and/or `{theme: 'action'}` modifiers are set in the parent component respectively.
Inside your `Components/Button/` you add folders `_type/` with `Button_type_link.tsx` file in it and `_theme/` with `Button_theme_action.tsx` .

```
App.tsx
Components/
  Button/
    Button.tsx
    index.tsx
+     _type/
+       Button_type_link.tsx
+     _theme/
+       Button_theme_action.tsx
```

Set up the variants:

**Note!** The second parameter in `withBemMod()` is the condition for this component to be applied.

**1.** In `Components/Button/_type/Button_type_link.tsx`

```
import * as React from 'react';
import { withBemMod, ModBody } from '@bem-react/core';
import { IButtonProps } from '../index';

const ButtonLink: ModBody<IButtonProps> = (Base, { text, className }) => (

  // className === 'Button Button_type_link'

  <a className={className}>{text}</a>
);

export const ButtonTypeLink = withBemMod<IButtonProps>('Button',
  { type: 'link' },
  ButtonLink);
```

**2.** In `Components/Button/_theme/Button_theme_action.tsx`

```
import { withBemMod } from  '@bem-react/core';
import { IButtonProps } from  '../index';

export  const  ButtonThemeAction = withBemMod<IButtonProps>('Button',
  { theme:  'action' });
```

#### Step 4.

Back in your `Components/Button/index.tsx` you need to **compose** all the variants with the basic Button.
Be careful with the import order - it directly affects your CSS rules.

```
import { compose, IClassNameProps } from  '@bem-react/core';
import { Button  as  Base } from  './Button';
import { ButtonTypeLink } from  './_type/Button_type_link';
import { ButtonThemeAction } from  './_theme/Button_theme_action';

export  interface  IButtonProps  extends  IClassNameProps {
  text: string;
  className: string;
  type?: 'link';
  theme?: 'action';
}

export  const  Button = compose(
  ButtonThemeAction,
  ButtonTypeLink
  )(Base);
```

**Note!** The order of optional components composed onto Base is important: in case you have different layouts and need to apply several modifiers the **FIRST** one inside the compose method will be rendered!
E.g., here:

```
export  const  Button = compose(
  ButtonThemeAction,
  ButtonTypeLink
  )(Base);
```

If your ButtonThemeAction was somewhat like

`<button className={className}>{text}</button>`,

your JSX-component:

`<Button type="link" theme="action" text="Hello"/>`

would render into HTML:

`<button classname="Button Button_theme_action Button_type_link">Hello</button>`

#### Step 5.

Finally, in your `App.tsx` you can use these options composed all together or partially:

```
import  *  as  React  from  'react'
import  Button  from  './Components/Button/Button'
import { cn } from  '@bem-react/classname'
import  './App.css'
const  cnApp  =  cn('App')
const  cnButton  =  cn('Button')

export  const  App:  React.SFC = () => {

  <div  className={cnApp()}>

    <Button
      text="I'm basic"
      className={cnButton()}
    />

    // Renders into HTML as:
    // <div class="Button">I'm Basic</div>


    <Button
      text="I'm type link"
      type="link"
      className={cnButton({type: 'link'})}
    />

    // Renders into HTML as:
    // <a class="Button Button_type_link">I'm type link</a>


    <Button
      text="I'm theme action"
      theme="action"
      className={cnButton({theme: 'action'})}
    />

    // Renders into HTML as:
    // <div class="Button Button_theme_action">I'm theme action</div>


    <Button
      text="I'm all together"
      theme="action"
      type="link"
      className={cnButton({theme: 'action', type: 'link'})}
    />

    // Renders into HTML as:
    // <a class="Button Button_theme_action Button_type_link">I'm all together</a>

  </div>
}

```

### Debug

To help your debug "@bem-react/core" support development mode.

For `<Button text="Hello" type="link" theme="action" />` (from **Example** above) React DevTools will show:

```html
<WithBemMod(Button)[theme:action][enabled] ...>
  <WithBemMod(Button)[type:link][enabled] ...className="Button Button_theme_action">
    <a className="Button Button_type_link Button_theme_action">Hello</a>
  </WithBemMod(Button)[type:link][enabled]>
</WithBemMod(Button)[theme:action][enabled]>
```
