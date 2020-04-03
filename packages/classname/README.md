# @bem-react/classname &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/classname.svg)](https://www.npmjs.com/package/@bem-react/classname) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@bem-react/classname.svg)](https://bundlephobia.com/result?p=@bem-react/classname)

Tiny helper for building CSS classes with BEM methodology.

## Install

```
npm i -S @bem-react/classname
```

## Usage

```js
import { cn } from '@bem-react/classname'

const cat = cn('Cat')

cat() // Cat
cat({ size: 'm' }) // Cat Cat_size_m
cat('Tail') // Cat-Tail
cat('Tail', { length: 'small' }) // Cat-Tail Cat-Tail_length_small

const dogPaw = cn('Dog', 'Paw')

dogPaw() // Dog-Paw
dogPaw({ color: 'black', exists: true }) // Dog-Paw Dog-Paw_color_black Dog-Paw_exists

// mixes

cat(null, ['Dog']) // Cat Dog
cat({ size: 'm' }, ['Dog', 'Horse']) // Cat Cat_size_m Dog Horse

cat('Tail', [dogPaw()]) // Cat-Tail Dog-Paw
cat('Tail', { length: 'small' }, [dogPaw({ color: 'black' })]) // Cat-Tail Cat-Tail_length_small Dog-Paw Dog-Paw_color_black
```

## Configure

By default `classname` uses React naming preset. But it's possible to use any.

```js
import { withNaming } from '@bem-react/classname'

const cn = withNaming({ n: 'ns-', e: '__', m: '_', v: '_' })

cn('block', 'elem')({ theme: 'default' }) // ns-block__elem_theme_default
```
