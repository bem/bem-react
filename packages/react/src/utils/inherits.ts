/**
 * Static properties of `React.ComponentClass`.
 */
const REACT_STATIC_FIELDS = ['childContextTypes', 'contextTypes', 'defaultProps', 'propTypes'];

/**
 * Create a new extended class.
 *
 * @param Super — base class
 * @param Derived — child class
 * @return extended class
 */
export function inherits(Super: any, Derived: any) {
    if (Super.prototype && Derived.prototype) {
        Object.setPrototypeOf(Derived.prototype, Super.prototype);

        // Set react static fields with merged from super and derived classes,
        // this behavior needs for modifiers.
        REACT_STATIC_FIELDS.forEach((propertyName) => {
            Object.defineProperty(Derived, propertyName, {
                value: { ...Derived[propertyName], ...Super[propertyName] },
                writable: true,
                configurable: true,
                enumerable: true
            });
        });

        return Object.setPrototypeOf(Derived, Super);
    }

    return Super;
}
