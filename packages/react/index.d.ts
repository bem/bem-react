declare namespace BemCore {
    // Preset React ---------------------------------------
    type AllHTMLAttributes<T> = React.AllHTMLAttributes<T>;
    type CSSProperties = React.CSSProperties;

    interface Preset {
        Base: typeof React.PureComponent;
        render: typeof React.createElement;
        naming: BEMSDK.NamingPreset;
    }

    type EntityClass<P = {}, S = {}> = React.PureComponent<P, S>;
    type Tag = React.ReactHTML;
    type Node = React.ReactNode;
    type SFC<P> = React.SFC<P>;

    type Content = null | string | number | JSX.Element;

    interface Bem<P> extends React.PureComponent<P, void> {

    }
    // ----------------------------------------------------

    type ModPredicate<P> = (props: P) => boolean;
    type ModBody<P> = (props: P) => any; // FIXME: it's not any it is extended from base class
    type ModHoc<P> = (props: P) => EntityClass<P> | null;

    interface ModDeclaratorSignature {
        /**
         * Entity modifier declaration helper
         *
         * @param predicate condition to apply modifier
         * @param body function with class to extend base implementation
         */
        <P>(predicate: ModPredicate<P>, body: ModBody<P>): ModHoc<P>;
    }

    interface WithModsSignature {
        <P0, P1, P2, P3, P4, P5, P6, P7, P8, P9>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>, p5: ModHoc<P5>, p6: ModHoc<P6>, p7: ModHoc<P7>, p8: ModHoc<P8>, p9: ModHoc<P9>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9>;
        <P0, P1, P2, P3, P4, P5, P6, P7, P8>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>, p5: ModHoc<P5>, p6: ModHoc<P6>, p7: ModHoc<P7>, p8: ModHoc<P8>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8>;
        <P0, P1, P2, P3, P4, P5, P6, P7>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>, p5: ModHoc<P5>, p6: ModHoc<P6>, p7: ModHoc<P7>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7>;
        <P0, P1, P2, P3, P4, P5, P6>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>, p5: ModHoc<P5>, p6: ModHoc<P6>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6>;
        <P0, P1, P2, P3, P4, P5>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>, p5: ModHoc<P5>): SFC<P0 & P1 & P2 & P3 & P4 & P5>;
        <P0, P1, P2, P3, P4>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>, p4: ModHoc<P4>): SFC<P0 & P1 & P2 & P3 & P4>;
        <P0, P1, P2, P3>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>, p3: ModHoc<P3>): SFC<P0 & P1 & P2 & P3>;
        <P0, P1, P2>(p0: ModHoc<P0>, p1: ModHoc<P1>, p2: ModHoc<P2>): SFC<P0 & P1 & P2>;
        <P0, P1>(h0: ModHoc<P0>, h1: ModHoc<P0>): SFC<P0 & P1>
        <P0>(h0: ModHoc<P0>): SFC<P0>
        (...hocs: any[]): SFC<any>;
    }

    interface Mods {
        [key: string]: string | boolean;
    }

    type Mix = string | BemJson | Array<string | BemJson>;

    type MultipleContent = Content[];

    interface BemJson {
        tag?: keyof Tag;
        block?: string;
        mods?: Mods;
        mix?: Mix;
        elem?: string;
        elemMods?: Mods;
    }

    interface BemPureProps extends BemJson {
        addBemClassName?: boolean;
        className?: string;
        childrend?: Content | MultipleContent;
    }
}

// TODO: drop it after https://github.com/bem/bem-sdk/issues/300
declare namespace BEMSDK {

    interface EntityName {
        block: string;
        elem?: string;
        mod?: EntityMod
    }

    interface EntityMod {
        name: string;
        val?: string | number | boolean;
    }

    interface NamingPreset {
        delims: {
            elem: string;
            mod: {
                name: string;
                val: string;
            }
        },
        fs: {
            pattern: string;
            scheme: string;
        },
        wordPattern: string;
    }

}
