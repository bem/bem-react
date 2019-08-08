# @bem-react/classname &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/classname.svg)](https://www.npmjs.com/package/@bem-react/classname) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/classname.svg)](https://bundlephobia.com/result?p=@bem-react/classname)

Tiny helper for building CSS classes with BEM methodology.

## Install

```
npm i -S @bem-react/classname
```

## Usage

``` js
import { cn } from '@bem-react/classname';

const cat = cn('Cat');

cat(); // Cat
cat({ size: 'm' }); // Cat Cat_size_m
cat('Tail'); // Cat-Tail
cat('Tail', { length: 'small' }); // Cat-Tail Cat-Tail_length_small

const dogPaw = cn('Dog', 'Paw');

dogPaw(); // Dog-Paw
dogPaw({ color: 'black', exists: true }); // Dog-Paw Dog-Paw_color_black Dog-Paw_exists
```

## CSS Modules

``` js
import { cn } from '@bem-react/classname';
import styles from './module.css';

const cat = cn('Cat', null, styles);

cat(); // Cat__2vc9d
cat({ size: 'm' }); // Cat__2vc9d Cat_size_m__382bU

const dogPaw = cn('Dog', 'Paw');

dogPaw(); // Dog-Paw__18kBi
dogPaw({ color: 'black', exists: true }); // Dog-Paw__18kBi Dog-Paw_color_black__35kTi Dog-Paw_exists (unseted in module)
```

## Configure

By default `classname` uses React naming preset. But it's possible to use any.

``` js
import { withNaming } from '@bem-react/classname';

const cn = withNaming({ n: 'ns-', e: '__', m: '_', v: '_' });

cn('block', 'elem')({ theme: 'default' }); // ns-block__elem_theme_default
```
