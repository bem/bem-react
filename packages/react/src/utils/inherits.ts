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

        Derived.defaultProps = Object.assign({}, Derived.defaultProps, Super.defaultProps);

        return Object.setPrototypeOf(Derived, Super);
    }

    return Super;
}
