import * as React from 'react';
import { NoStrictEntityMods } from '@bem-react/classname';
export interface IClassNameProps {
    className?: string;
}
export declare type ModBody<P extends IClassNameProps> = (Block: React.ComponentType<P>, props: P) => JSX.Element;
export declare type Dictionary<T> = T & {
    [key: string]: any;
};
export declare function withBemMod<P extends IClassNameProps>(blockName: string, mod: NoStrictEntityMods, cb?: ModBody<P>): (WrappedComponent: React.ComponentType<P>) => (props: Dictionary<P>) => JSX.Element;
export declare type C<T> = React.ComponentType<T>;
export declare type H<T> = (Component: C<T>) => C<T>;
export declare function compose<T0>(h0: H<T0>): <T>(f: C<T>) => C<T & T0>;
export declare function compose<T0, T1>(h0: H<T0>, h1: H<T1>): <T>(f: C<T>) => C<T & (T0 | T1)>;
export declare function compose<T0, T1, T2>(h0: H<T0>, h1: H<T1>, h2: H<T2>): <T>(f: C<T>) => C<T & (T0 | T1 | T2)>;
export declare function compose<T0, T1, T2, T3>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3)>;
export declare function compose<T0, T1, T2, T3, T4>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4)>;
export declare function compose<T0, T1, T2, T3, T4, T5>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>, h14: H<T14>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14)>;
export declare function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(h0: H<T0>, h1: H<T1>, h2: H<T2>, h3: H<T3>, h4: H<T4>, h5: H<T5>, h6: H<T6>, h7: H<T7>, h8: H<T8>, h9: H<T9>, h10: H<T10>, h11: H<T11>, h12: H<T12>, h13: H<T13>, h14: H<T14>, h15: H<T15>): <T>(f: C<T>) => C<T & (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14 | T15)>;
