import { ComponentType, StatelessComponent, createElement } from 'react'
import { cn, NoStrictEntityMods, ClassNameFormatter } from '@bem-react/classname'
import { classnames } from '@bem-react/classnames'

export interface IClassNameProps {
  className?: string
}

export type Enhance<T extends IClassNameProps> = (
  WrappedComponent: ComponentType<T>,
) => ComponentType<T>

type Dictionary<T = any> = { [key: string]: T }

export function withBemMod<T, U extends IClassNameProps = {}>(
  blockName: string,
  mod: NoStrictEntityMods,
  enhance?: Enhance<T & U>,
) {
  let entity: ClassNameFormatter
  let entityClassName: string
  let modNames: string[]

  return function WithBemMod<K extends IClassNameProps = {}>(
    WrappedComponent: ComponentType<T & K>,
  ) {
    // Use cache to prevent create new component when props are changed.
    let ModifiedComponent: ComponentType<any>
    let modifierClassName: string
    entity = entity || cn(blockName)
    entityClassName = entityClassName || entity()

    function BemMod(props: T & K) {
      modNames = modNames || Object.keys(mod)
      // TODO: For performance can rewrite `every` to `for (;;)`.
      const isModifierMatched = modNames.every((key: string) => {
        const modValue = mod[key]
        const propValue = (props as any)[key]

        return modValue === propValue || (modValue === '*' && Boolean(propValue))
      })

      if (isModifierMatched) {
        const modifiers = modNames.reduce((acc: Dictionary, key: string) => {
          if (mod[key] !== '*') acc[key] = mod[key]

          return acc
        }, {})
        modifierClassName = modifierClassName || entity(modifiers)

        const nextProps = Object.assign({}, props)

        nextProps.className = classnames(modifierClassName, props.className)
          // Replace first entityClassName for remove duplcates from className.
          .replace(`${entityClassName} `, '')

        if (enhance !== undefined) {
          if (ModifiedComponent === undefined) {
            ModifiedComponent = enhance(WrappedComponent as any)

            if (__DEV__) {
              setDisplayName(ModifiedComponent, {
                wrapper: 'WithBemModEnhance',
                wrapped: WrappedComponent,
              })
            }
          }
        } else {
          ModifiedComponent = WrappedComponent as any
        }

        // Use createElement instead of jsx to avoid __assign from tslib.
        return createElement(ModifiedComponent, nextProps)
      }

      // Use createElement instead of jsx to avoid __assign from tslib.
      return createElement(WrappedComponent, props)
    }

    if (__DEV__) {
      setDisplayName(BemMod, {
        wrapper: WithBemMod,
        wrapped: entityClassName,
        value: mod,
      })
    }

    return BemMod
  }
}

function getDisplayName<T>(Component: ComponentType<T> | string) {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component'
}

type DisplayNameMeta = {
  /**
   * Wrapper component.
   */
  wrapper: any

  /**
   * Wrapped component.
   */
  wrapped: any

  /**
   * Modifiers entity.
   */
  value?: any
}

function setDisplayName(Component: ComponentType<any>, meta: DisplayNameMeta) {
  const wrapperName = getDisplayName(meta.wrapper)
  const wrappedName = getDisplayName(meta.wrapped)

  Component.displayName = `${wrapperName}(${wrappedName})`

  if (meta.value !== undefined) {
    const value = JSON.stringify(meta.value)
      .replace(/\{|\}|\"|\[|\]/g, '')
      .replace(/,/g, ' | ')

    Component.displayName += `[${value}]`
  }
}

type FlatObject<T> = T extends object ? { [P in keyof T]: T[P] } : T
export type ExtractProps<T> = T extends ComponentType<infer K> ? { [P in keyof K]: K[P] } : never
export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>
export type Wrapper<T> = HOC<T>
export type Composition<T> = <U extends ComponentType<any>>(
  fn: U,
) => StatelessComponent<FlatObject<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>>

/* tslint:disable:max-line-length */
export function compose<T1>(fn1: HOC<T1>): Composition<T1>

export function compose<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): Composition<T1 & T2>

export function compose<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): Composition<T1 & T2 & T3>

export function compose<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): Composition<T1 & T2 & T3 & T4>

export function compose<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): Composition<T1 & T2 & T3 & T4 & T5>

export function compose<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6>

export function compose<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7>

export function compose<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>

export function compose(...fns: Array<HOC<any>>): Composition<any>
/* tslint:enable:max-line-length */

/**
 * @param funcs higher order components
 *
 * @example
 * ```ts
 * import { compose } from '@bem-react/core';
 *
 * const Enhanced = compose(
 *     withBemMod('Component', { size: 's' }),
 *     withBemMod('Component', { theme: 'normal' }),
 * )(Component);
 * ```
 */
export function compose(...funcs: any[]) {
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg)
}

type IsOptional<T> = Exclude<T, undefined> extends never ? false : true

type IsSimpleMods<T1, T2 = T1, T3 = T1, T4 = T1, T5 = T1, T6 = T1, T7 = T1, T8 = T1> = Exclude<
  keyof T1 | keyof T2 | keyof T3 | keyof T4 | keyof T5 | keyof T6 | keyof T7 | keyof T8,
  keyof T1 & keyof T2 & keyof T3 & keyof T4 & keyof T5 & keyof T6 & keyof T7 & keyof T8
> extends never
  ? true
  : false

// type ToIntersection<T> = (T extends any ? (x: T) => void : never) extends (x: infer U) => void
//   ? U
//   : never
//
// Works correctly with TS 3.7
// type IsSimpleMods<T1, T2 = T1, T3 = T1, T4 = T1, T5 = T1, T6 = T1, T7 = T1, T8 = T1> = ToIntersection<
//   keyof T1 | keyof T2 | keyof T3 | keyof T4 | keyof T5 | keyof T6 | keyof T7 | keyof T8
// > extends never
//   ? false
//   : true

type CompositionU<T1, T2 = T1, T3 = T1, T4 = T1, T5 = T1, T6 = T1, T7 = T1, T8 = T1> = Composition<
  IsSimpleMods<T1, T2, T3, T4, T5, T6, T7, T8> extends true
    ? {
        [P in keyof T1 &
          keyof T2 &
          keyof T3 &
          keyof T4 &
          keyof T5 &
          keyof T6 &
          keyof T7 &
          keyof T8]: IsOptional<
          T1[P] | T2[P] | T3[P] | T4[P] | T5[P] | T6[P] | T7[P] | T8[P]
        > extends true
          ? { [K in P]?: T1[K] | T2[K] | T3[K] | T4[K] | T5[K] | T6[K] | T7[K] | T8[K] }
          : { [K in P]: T1[K] | T2[K] | T3[K] | T4[K] | T5[K] | T6[K] | T7[K] | T8[K] }
      }[keyof T1 & keyof T2 & keyof T3 & keyof T4 & keyof T5 & keyof T6 & keyof T7 & keyof T8]
    : T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8
>

/* tslint:disable:max-line-length */
export function composeU<T1>(fn1: HOC<T1>): CompositionU<T1>

export function composeU<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): CompositionU<T1, T2>

export function composeU<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): CompositionU<T1, T2, T3>

export function composeU<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): CompositionU<T1, T2, T3, T4>

export function composeU<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): CompositionU<T1, T2, T3, T4, T5>

export function composeU<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): CompositionU<T1, T2, T3, T4, T5, T6>

export function composeU<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): CompositionU<T1, T2, T3, T4, T5, T6, T7>

export function composeU<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): CompositionU<T1, T2, T3, T4, T5, T6, T7, T8>

export function composeU(...fns: Array<HOC<any>>): Composition<any>
/* tslint:enable:max-line-length */

export function composeU(...args: any[]) {
  return compose(...args)
}
