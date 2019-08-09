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
export function classnames(...strings: Array<string | undefined>) {
    let className = '';
    const uniqueCache = new Set();
    const classNameList = strings.join(' ').split(' ');

    for (const value of classNameList) {
        if (value === '' || uniqueCache.has(value)) {
            continue;
        }

        uniqueCache.add(value);
        if (className.length > 0) className += ' ';
        className += value;
    }

    return className;
}
