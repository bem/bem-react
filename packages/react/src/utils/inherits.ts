/**
 * Create a new extended class.
 *
 * @param Super — base class
 * @param Derived — child class
 * @return extended class
 */
export function inherits(Super: any, Derived: any) {
    if (Super.prototype && Derived.prototype) {
        // Derived.super_ = Super;
        Object.setPrototypeOf(Derived.prototype, Super.prototype);
        return Object.setPrototypeOf(Derived, Super);
    }

    return Super;
}
