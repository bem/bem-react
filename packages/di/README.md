# DI

DI (dependency injection) is very simple way to use any versions of components in any place of your App.

Let's see an example.

## Problem

You already wrote React-components for your BEM App:

```tsx
// components/Button/Button.tsx

import * as React from 'react';
import { cn } from '@bem-react/classname';

const cnButton = cn('Button');

export interface IButtonProps {
    text: string;
}

export interface IButtonState {
    pointed: boolean;
}

export class Button extends React.Component<IButtonProps, IButtonState> {
    constructor() {
        this.state = { pointed: false };
    }

    private onPointerEnter() {
        this.setState({ pointed: true });
    }

    private onPointerLeave() {
        this.setState({ pointed: false });
    }

    protected abstract attrs: () => React.DOMAttributes;

    render() {
        return (
            <div className={cnButton(this.state)} {...this.attrs()}>
                {this.props.text}
            </div>
        );
    }
}

// components/App/App.tsx

import * as React from 'react';
import { Button } from '../Button/Button';

export const App: React.SFC = () => <Button text="Hello there!" />;
```

At some point you realized that "Button" should behave differently on desktop and mobile platforms.

Two questions:

- **Q1.** How to describe two versions of "Button"?
- **Q2.** How to do import specific version of "Button" with minimum effort?

## Solution

**A1.** Describing two versions of a component:

```tsx
// components/Button/Button@desktop.tsx - desktop version

import * as React from 'react';
import { Button as ButtonCommon } from './Button';

export class Button extends ButtonCommon {
    protected attrs() {
        return {
            onMouseEnter: this.onPointerEnter,
            onMouseLeave: this.onPointerLeave,
        };
    }
}

// components/Button/Button@mobile.tsx - mobile version

import * as React from 'react';
import { Button as ButtonCommon } from './Button';

export class Button extends ButtonCommon {
    protected attrs() {
        return {
            onTouchMove: this.onPointerEnter,
            onTouchEnd: this.onPointerLeave,
        };
    }
}
```

**A2.** Importing components with "di":

```tsx
// components/App/App@desktop.tsx

import { Registry, withRegistry } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { App as AppCommon } from './App';
import { Button } from '../Button/Button@desktop';

const cnApp = cn('App');
const cnButton = cn('Button');

// registry with desktop versions of components
const registry = new Registry({ id: cnApp() });

registry.set(cnButton(), Button);

export const App = withRegistry(registry)(AppCommon);

// components/App/App@mobile.tsx
//
// ...very similar...
//

// components/App/App.tsx - with small changes

import * as React from 'react';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { IButtonProps } from '../Button/Button';

const cnApp = cn('App');
const cnButton = cn('Button');

export const App: React.SFC = () => (
    <RegistryConsumer>
        {registries => {
            // reading App registry
            const registry = registries[cnApp()];

            // taking desktop or mobile version
            const Button = registry.get<IButtonProps>(cnButton());

            return <Button text="Hello there!" />;
        }}
    </RegistryConsumer>
);
```
