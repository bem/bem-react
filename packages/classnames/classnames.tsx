/**
 * classNames merge function.
 *
 * @example
 * ``` ts
 *
 * import { classnames } from '@bem-react/classname';
 *
 * classnames('Block', 'Mix', undefined, 'Block'); // 'Block Mix'
 * ```
 *
 * @param strings classNames strings
 */
export function classnames(...strings: Array<string | undefined>): string;
export function classnames() {
    let className = '';
    const uniqueCache = new Set();
    // Use arguments instead rest operator for better performance.
    const classNameList: Array<string | undefined> = [].slice.call(arguments);

    for (const value of classNameList) {
        if (value === '' || value === undefined || uniqueCache.has(value)) {
            continue;
        }

        uniqueCache.add(value);
        if (className.length > 0) className += ' ';
        className += value;
    }

    return className;
}
