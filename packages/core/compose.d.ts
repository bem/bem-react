import { ComponentType, StatelessComponent } from 'react'
export declare type ExtractProps<T> = T extends ComponentType<infer K>
  ? {
      [P in keyof K]: K[P]
    }
  : never
export declare type HOC<T> = (WrappedComponent: ComponentType) => ComponentType<T>
export declare type Wrapper<T> = HOC<T>
export declare type Composition<T> = <U extends ComponentType<any>>(
  fn: U,
) => StatelessComponent<JSX.LibraryManagedAttributes<U, ExtractProps<U>> & T>
export declare function compose<T1>(fn1: HOC<T1>): Composition<T1>
export declare function compose<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): Composition<T1 & T2>
export declare function compose<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): Composition<T1 & T2 & T3>
export declare function compose<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): Composition<T1 & T2 & T3 & T4>
export declare function compose<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): Composition<T1 & T2 & T3 & T4 & T5>
export declare function compose<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6>
export declare function compose<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7>
export declare function compose<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): Composition<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>
export declare function compose(...fns: Array<HOC<any>>): Composition<any>
export declare function composeU<T1>(fn1: HOC<T1>): Composition<T1>
export declare function composeU<T1, T2>(fn1: HOC<T1>, fn2: HOC<T2>): Composition<T1 | T2>
export declare function composeU<T1, T2, T3>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
): Composition<T1 | T2 | T3>
export declare function composeU<T1, T2, T3, T4>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
): Composition<T1 | T2 | T3 | T4>
export declare function composeU<T1, T2, T3, T4, T5>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
): Composition<T1 | T2 | T3 | T4 | T5>
export declare function composeU<T1, T2, T3, T4, T5, T6>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6>
export declare function composeU<T1, T2, T3, T4, T5, T6, T7>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7>
export declare function composeU<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: HOC<T1>,
  fn2: HOC<T2>,
  fn3: HOC<T3>,
  fn4: HOC<T4>,
  fn5: HOC<T5>,
  fn6: HOC<T6>,
  fn7: HOC<T7>,
  fn8: HOC<T8>,
): Composition<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>
export declare function composeU(...fns: Array<HOC<any>>): Composition<any>
