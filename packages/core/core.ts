import { ComponentType, StatelessComponent, createElement, forwardRef } from 'react'
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

type withBemModOptions = {
  __passToProps: boolean
  __simple: boolean
}

export function withBemMod<T, U extends IClassNameProps = {}>(
  blockName: string,
  mod: NoStrictEntityMods,
  enhance?: Enhance<T & U> | withBemModOptions,
) {
  let entity: ClassNameFormatter
  let entityClassName: string
  let modNames: string[]

  function WithBemMod<K extends IClassNameProps = {}>(WrappedComponent: ComponentType<T & K>) {
    // Use cache to prevent create new component when props are changed.
    let ModifiedComponent: ComponentType<any>
    let modifierClassName: string
    entity = entity || cn(blockName)
    entityClassName = entityClassName || entity()

    const BemMod = forwardRef((props: T & K, ref) => {
      modNames = modNames || Object.keys(mod)

      // TODO: For performance can rewrite `every` to `for (;;)`.
      const isModifierMatched = modNames.every((key: string) => {
        const modValue = mod[key]
        const propValue = (props as any)[key]

        return modValue === propValue || (modValue === '*' && Boolean(propValue))
      })

      const nextProps = Object.assign({}, props, { ref })

      if (isModifierMatched) {
        const modifiers = modNames.reduce((acc: Dictionary, key: string) => {
          if (mod[key] !== '*') acc[key] = mod[key]

          return acc
        }, {})
        modifierClassName = modifierClassName || entity(modifiers)

        nextProps.className = classnames(modifierClassName, props.className)
          // Replace first entityClassName for remove duplcates from className.
          .replace(`${entityClassName} `, '')

        if (typeof enhance === 'function') {
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
      return createElement(WrappedComponent, nextProps)
    })

    if (__DEV__) {
      setDisplayName(BemMod, {
        wrapper: WithBemMod,
        wrapped: entityClassName,
        value: mod,
      })
    }

    return BemMod
  }

  // These typings should work properly for class components as well as for forwardRef chains
  // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35834#issuecomment-497605842
  const withMod = WithBemMod as {
    <K extends IClassNameProps, Q extends React.ComponentClass<T & K>>(
      WrappedComponent: Q,
    ): React.ForwardRefExoticComponent<
      React.ComponentPropsWithoutRef<Q> & { ref?: React.Ref<InstanceType<Q>> }
    >

    <K extends IClassNameProps>(
      WrappedComponent: React.ForwardRefExoticComponent<T & K & { ref?: React.Ref<any> }>,
    ): React.ForwardRefExoticComponent<T & K & { ref?: React.Ref<any> }>

    <K extends IClassNameProps>(
      Component: React.FunctionComponent<T & K>,
    ): React.ForwardRefExoticComponent<T & K>

    __isSimple: boolean
    __blockName?: string
    __mod?: string
    __value?: string | number | boolean
    __passToProps?: boolean
  }

  const { __passToProps = true, __simple = false } = (enhance as withBemModOptions) || {}

  const keys = Object.keys(mod)
  const isSimple = !enhance && keys.length === 1
  const name = keys[0]
  const value = mod[keys[0]]

  withMod.__isSimple = isSimple || __simple

  if (withMod.__isSimple) {
    withMod.__blockName = blockName
    withMod.__mod = name
    withMod.__value = value
    withMod.__passToProps = __passToProps
  }

  return withMod
}

export function createClassNameModifier<T>(blockName: string, mod: NoStrictEntityMods) {
  return withBemMod<T>(blockName, mod, { __passToProps: false, __simple: true })
}

export type ExtractProps<T> = T extends ComponentType<infer K> ? { [P in keyof K]: K[P] } : never
export type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>
export type Wrapper<T> = HOC<T>
export type Composition<T> = <U extends ComponentType<any>>(
  fn: U,
) => StatelessComponent<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>

function composeSimple(mods: any[]) {
  const { __blockName } = mods[0]
  const allMods: Record<string, (string | boolean)[]> = {}
  const allModsPassProps: Record<string, boolean[]> = {}

  const entity = cn(__blockName)

  for (let { __mod, __value, __passToProps } of mods) {
    allMods[__mod] = allMods[__mod] || []
    // для оптимизации поиска вводим простой массив вместо объекта
    allModsPassProps[__mod] = allModsPassProps[__mod] || []

    allMods[__mod].push(__value)
    allModsPassProps[__mod].push(__passToProps)
  }

  const modNames = Object.keys(allMods)

  return (Base: ComponentType<any>) => {
    function SimpleComposeWrapper(props: Record<string, any>) {
      const modifiers: NoStrictEntityMods = {}
      const newProps: any = { ...props }

      for (let key of modNames) {
        const modValues = allMods[key]
        const propValue = props[key]

        let foundModifierIndex = modValues.indexOf(propValue)

        // обрабатываем кейс когда у нас один модификатор со значением true
        if (foundModifierIndex === -1 && modValues[0] === true && propValue === false) {
          foundModifierIndex = 0
        }

        if (foundModifierIndex !== -1) {
          modifiers[key] = propValue
          // если стоит флаг __passToProps = false, то не добавляем в пропсы
          if (!allModsPassProps[key][foundModifierIndex]) {
            delete newProps[key]
          }
          // если значение для модификатора undefined, то удаляем свойство
        } else if (newProps.hasOwnProperty(key) && propValue === undefined) {
          delete newProps[key]
        }
      }

      newProps.className = entity(modifiers, [props.className])

      return createElement(Base, newProps)
    }
    if (__DEV__) {
      const allModsFormatted = Object.keys(allMods)
        .map((key) => {
          const mods
            = allMods[key].length > 3 ? ` ${allMods[key].length} mods` : allMods[key].join('|')

          return `[${key}:${mods}]`
        })
        .join(',')

      SimpleComposeWrapper.displayName = `SimpleComposeWrapper ${allModsFormatted}`
    }

    return SimpleComposeWrapper
  }
}

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

  const simple: any[] = []
  const enhanced = []
  for (let f of fns) {
    f.__isSimple ? simple.push(f) : enhanced.push(f)
  }

  const oprimizedFns = simple.length ? [composeSimple(simple), ...enhanced] : enhanced

  return oprimizedFns.reduce(
    (a, b) => {
      return function() {
        return a(b.apply(0, arguments))
      }
    },
    (arg: any) => arg,
  )
}

type SafeUnionType<P, C> = P extends keyof C ? C[P] : never

type DeepUnion2<T1, T2> = {
  [P in keyof (T1 & T2)]: SafeUnionType<P, T1> | SafeUnionType<P, T2>
}

type DeepUnion3<T1, T2, T3> = {
  [P in keyof (T1 & T2 & T3)]: SafeUnionType<P, T1> | SafeUnionType<P, T2> | SafeUnionType<P, T3>
}
type DeepUnion4<T1, T2, T3, T4> = {
  [P in keyof (T1 & T2 & T3 & T4)]:
    | SafeUnionType<P, T1>
    | SafeUnionType<P, T2>
    | SafeUnionType<P, T3>
    | SafeUnionType<P, T4>
}
type DeepUnion5<T1, T2, T3, T4, T5> = {
  [P in keyof (T1 & T2 & T3 & T4 & T5)]:
    | SafeUnionType<P, T1>
    | SafeUnionType<P, T2>
    | SafeUnionType<P, T3>
    | SafeUnionType<P, T4>
    | SafeUnionType<P, T5>
}
type DeepUnion6<T1, T2, T3, T4, T5, T6> = {
  [P in keyof (T1 & T2 & T3 & T4 & T5 & T6)]:
    | SafeUnionType<P, T1>
    | SafeUnionType<P, T2>
    | SafeUnionType<P, T3>
    | SafeUnionType<P, T4>
    | SafeUnionType<P, T5>
    | SafeUnionType<P, T6>
}
type DeepUnion7<T1, T2, T3, T4, T5, T6, T7> = {
  [P in keyof (T1 & T2 & T3 & T4 & T5 & T6 & T7)]:
    | SafeUnionType<P, T1>
    | SafeUnionType<P, T2>
    | SafeUnionType<P, T3>
    | SafeUnionType<P, T4>
    | SafeUnionType<P, T5>
    | SafeUnionType<P, T6>
    | SafeUnionType<P, T7>
}
type DeepUnion8<T1, T2, T3, T4, T5, T6, T7, T8> = {
  [P in keyof (T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8)]:
    | SafeUnionType<P, T1>
    | SafeUnionType<P, T2>
    | SafeUnionType<P, T3>
    | SafeUnionType<P, T4>
    | SafeUnionType<P, T5>
    | SafeUnionType<P, T6>
    | SafeUnionType<P, T7>
    | SafeUnionType<P, T8>
}

export function composeU<T1>(fn1: HOC<T1>): Composition<T1>

export function composeU<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): Composition<DeepUnion2<T1, T2>>

export function composeU<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): Composition<DeepUnion3<T1, T2, T3>>

export function composeU<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): Composition<DeepUnion4<T1, T2, T3, T4>>

export function composeU<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): Composition<DeepUnion5<T1, T2, T3, T4, T5>>

export function composeU<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): Composition<DeepUnion6<T1, T2, T3, T4, T5, T6>>

export function composeU<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): Composition<DeepUnion7<T1, T2, T3, T4, T5, T6, T7>>

export function composeU<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): Composition<DeepUnion8<T1, T2, T3, T4, T5, T6, T7, T8>>

export function composeU(...fns: Array<HOC<any>>): Composition<any>

export function composeU(...args: any[]) {
  return compose(...args)
}
