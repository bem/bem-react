import { ComponentType, StatelessComponent, createElement } from 'react'
import { cn, NoStrictEntityMods, ClassNameFormatter } from '@bem-react/classname'
import { classnames } from '@bem-react/classnames'

function getDisplayName(Component: ComponentType | string) {
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

  // Use cache to prevent create new component when props are changed.
  let ModifiedComponent: ComponentType<any>

  return function WithBemMod<K extends IClassNameProps = {}>(
    WrappedComponent: ComponentType<T & K>,
  ) {
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

export type ExtractProps<T> = T extends ComponentType<infer K> ? { [P in keyof K]: K[P] } : never
export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>
export type Wrapper<T> = HOC<T>
export type Composition<T> = <U extends ComponentType<any>>(
  fn: U,
) => StatelessComponent<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>

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
export function compose() {
  // Use arguments instead of rest-arguments to get faster and more compact code.
  const fns: any[] = [].slice.call(arguments)

  return fns.reduce(
    (a, b) => {
      return function() {
        return a(b.apply(0, arguments))
      }
    },
    (arg: any) => arg,
  )
}

export function composeU<T1>(fn1: HOC<T1>): Composition<T1>

export function composeU<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): Composition<T1 | T2>

export function composeU<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): Composition<T1 | T2 | T3>

export function composeU<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): Composition<T1 | T2 | T3 | T4>

export function composeU<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): Composition<T1 | T2 | T3 | T4 | T5>

export function composeU<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6>

export function composeU<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7>

export function composeU<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>

export function composeU(...fns: Array<HOC<any>>): Composition<any>

export function composeU(...args: any[]) {
  return compose(...args)
}
