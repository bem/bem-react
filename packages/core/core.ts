import { ComponentType, createElement } from 'react'
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

export * from './compose'
