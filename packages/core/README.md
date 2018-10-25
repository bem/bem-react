# core &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/core.svg)](https://www.npmjs.com/package/@bem-react/core) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/core.svg)](https://bundlephobia.com/result?p=@bem-react/core)

Tiny helper for [BEM modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in React.

## Install

> npm i -S @bem-react/core

## Usage

``` js
import { withBemMod, IClassNameProps } from '@bem-react/core';

interface IPresenterProps extends IClassNameProps {
    theme?: 'normal';
    view?: 'default';
}

const presenter = cn('Presenter');

const Presenter: React.SFC<IPresenterProps> = ({ className }) =>
    <div className={presenter({}, [className])} />;

    const Enhanced1 = withBemMod<IPresenterProps>(presenter(), { theme: 'normal' })(Presenter);
    const Enhanced2 = withBemMod<IPresenterProps>(presenter(), { view: 'default' })(Enhanced1);
    const Component = <Enhanced2 className="Additional" theme="normal" view="default" />; // Component will have following classnames: `Presenter Presenter_theme_normal Presenter_view_default Additional`
```

### compose

``` js
import { compose } from '@bem-react/core';

const Enhcanced = compose(
    withBemMod('Component', { size: 's' }),
    withBemMod('Component', { theme: 'normal' }),
)(Component);
```
