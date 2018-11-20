# Dependency Injection (DI)

**Dependency Injection (DI)** allows you to split React components into separate versions and comfortably switch them in the project whenever needed, e.g., to make a specific bundle.

DI package helps to solve similar tasks with minimum effort:
- decouple *desktop* and *mobile* versions of a component
- implement an *experimental* version of a component alongside the common one

## Install
```
npm i @bem-react/di -S
```


## Quick start

**Note!** This example uses [ClassName package](https://github.com/bem/bem-react-core/tree/v3/packages/classname).

E.g., for a structure like this:
```
Components/
  Header/
    Header@desktop.tsx
    Header@mobile.tsx
  Footer/
    Footer@desktop.tsx
    Footer@mobile.tsx
App.tsx
```

First, create two files that define two versions of the App and use different sets of components: **App@<span></span>desktop.tsx** and **App@<span></span>mobile.tsx**. Put them near **App.tsx**.

In each App version (**App@<span></span>desktop.tsx** and **App@<span></span>mobile.tsx**) we should define which components should be used.
Three steps to do this:
1. Create a registry with a particular id:
```
const registry = new Registry({ id: cnApp() });
```
2. Register all the needed components versions under a descriptive key (keys, describing similar components, should be the same across all the versions):
```
registry.set(cnHeader(), Header);
registry.set(cnFooter(), Footer);
```
3. Export the App version with its registry of components:
```
export const AppNewVersion = withRegistry(registry)(AppCommon);
```

The files should look like this:

**App@<span></span>desktop.tsx**
```
import { cn } from '@bem-react/classname';
import { Registry, withRegistry } from '@bem-react/di';
import { App as AppCommon } from './App';

import { Footer } from './Components/Footer/Footer@desktop';
import { Header } from './Components/Header/Header@desktop';

const cnApp = cn('App');
const cnHeader = cn('Header');
const cnFooter = cn('Footer');

const registry = new Registry({ id: cnApp() });

registry.set(cnHeader(), Header);
registry.set(cnFooter(), Footer);

export const AppDesktop = withRegistry(registry)(AppCommon);
```

**App@<span></span>mobile.tsx**
```
import { cn } from '@bem-react/classname';
import { Registry, withRegistry } from '@bem-react/di';
import { App as AppCommon } from './App';

import { Footer } from './Components/Footer/Footer@mobile';
import { Header } from './Components/Header/Header@mobile';

const cnApp = cn('App');
const cnHeader = cn('Header');
const cnFooter = cn('Footer');

const registry = new Registry({ id: cnApp() });

registry.set(cnHeader(), Header);
registry.set(cnFooter(), Footer);

export const AppMobile = withRegistry(registry)(AppCommon);
```

Time to use these versions in your app dynamically! 

**App.tsx**  
If your dependencies were static before
```
import { cn } from '@bem-react/classname';
import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';

const cnPage = cn('Page');

export const App: React.SFC = () => (
    <div className={ cnPage() }>
        <Header />
        <Content />
        <Footer />
    </div>
);
```

Now the dependencies can be injected based on the currently used registry
```
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';

// No Header or Footer imports

const cnApp = cn('App');
const cnPage = cn('Page');
const cnHeader = cn('Header');
const cnFooter = cn('Footer');

export const App: React.SFC = () => (
    <RegistryConsumer>
        {registries => {
            // Get registry with components
            const registry = registries[cnApp()];
            
            // Get the needed version of the component based on registry
            const Header = registry.get(cnHeader());
            const Footer = registry.get(cnFooter());

            return(
                <div className={ cnPage() }>
                    <Header />
                    <Content />
                    <Footer />
                </div>
            );
        }}
    </RegistryConsumer>
);

export default App;
```

So you could use different versions of your app e.g. for conditional rendering on your server side or to create separate bundles
```
import { AppDesktop } from './path-to/App@desktop';
import { AppMobile } from './path-to/App@mobile';
```
