declare module 'bem-react-core' {
    import React from 'react';

    type Props = React.ClassAttributes;
    type Klass = React.ComponentClass;
    type ObjectMode = ((props: Props, state: object) => object) | object;
    type Content = null | string | number | JSX.Element;
    type MultipleContent = Array<Content>;

    interface Declaration {
        applyDecls(): Klass;
    }

    interface Mods {
        [modName]: boolean | string;
    }

    interface JsonMix {
        block: string;
        elem?: string;
        mods?: Mods;
        elemMods?: Mods;
    }

    type Mix = JsonMix | string | JSX.Element;
    type Replaceble = null | number | string | JSX.Element;

    interface Block {
        block: string;
        tag?: string;
        cls?: ((props: Props, state: object) => string) | string;
        addBemClassName?: ((props: Props, state: object) => boolean) | boolean;
        style?: ObjectMode;
        attrs?: ObjectMode;
        mods?: Mods | ((props: Props, state: object) => Mods);
        mix?: Mix | ((props: Props, state: object) => Mix);
        addMix?: Mix | ((props: Props, state: object) => Mix);
        content?: ((props: Props, state: object) => Content | MultipleContent) | Content | MultipleContent;
        replace?: ((props: Props, state: object) => Replaceble) | Replaceble;
        wrap?(props: Props, state: object, klass: Klass): Content;
        willInit?(props: Props): void;
    }

    interface Elem extends Block {
        elem: string;
    }

    type Mixin = Klass | Array<Klass>;
    type Entity = Block|Elem;

    interface EntityStatic {
        propTypes?: Props,
        contextTypes?: Props,
        childContextTypes?: Props,
        [fieldName]: any
    }

    export function decl(entity: Entity, static?: EntityStatic): Declaration;
    export function decl(mixin?: Mixin, entity: Entity, static?: EntityStatic): Declaration;
}
