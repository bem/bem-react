declare module 'bem-react-core' {
    import React from 'react';

    type Props = React.ClassAttributes<Object>;
    type ReactClass = React.ComponentClass;
    type ObjectMode = ((props: Props, state: object) => object) | object;
    type Content = null | string | number | JSX.Element;
    type MultipleContent = Array<Content>;

    interface Declaration<P> {
        applyDecls(): React.ComponentClass<P>;
    }

    interface Mods {
        [modName: string]: boolean | string;
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
        wrap?(props: Props, state: object, klass: ReactClass): Content;
        willInit?(props: Props): void;
    }

    interface Elem extends Block {
        elem: string;
    }

    type Mixin = ReactClass | Array<ReactClass>;
    type Entity = Block|Elem;

    interface EntityStatic {
        propTypes?: Props,
        contextTypes?: Props,
        childContextTypes?: Props,
        [fieldName: string]: any
    }

    /**
     * Базовые bem свойства в объеденинии с поддерживаемыми HTML свойствами.
     */
    interface BemBlock extends React.HTMLProps<Props> {
        block?: string;
        elem?: string
        tag?: string;
        cls?: string;
        addBemClassName?: boolean;
        style?: object;
        attrs?: object;
        mods?: Mods;
        mix?: Mix;
    }

    /**
     * Базовый компонент, чтоб не делать декларации для простых блоков
     */
    class Bem<S> extends React.Component<BemBlock, S> {
        props: Readonly<BemBlock>;
    }

    /**
     * Матчер на модификатор
     *
     * @description
     * Обычно это функция, но есть короткий вариант [сахар]{@link PredicateShort}
     */
    type Predicate = ((props: Props, state: object) => boolean | PredicateShort)

    /**
     * Сахар над матчером на модификаторб передается в ввиде хеша
     *
     * @description
     * Значения могут быть 3х типов
     *  - функция - вызовится для проверки
     *  - значение - значение с простым типом данных
     *  - '*' - специальное значение, матчит на присутвие свойства
     */
    interface PredicateShort {
        [prop: string]: ((props: Props, state: object) => boolean) | (number | string | boolean) | '*'
    }

    export function decl(entity: Entity, static?: EntityStatic, wrapper?: Function): Declaration<Props>;
    export function decl(mixin: Mixin, entity: Entity, static?: EntityStatic, wrapper?: Function): Declaration<Props>;

    /**
     * Декларация модификатора
     */
    export function declMod(predicate: Predicate, fields: Entity, staticFields?: EntityStatic): Declaration<Props>;
}
