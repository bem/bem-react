import { ComponentType, StatelessComponent } from 'react'

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
