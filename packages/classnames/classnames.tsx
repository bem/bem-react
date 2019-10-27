/**
 * Merge all unique strings into string.
 *
 * @example
 * classnames('Block', 'Mix', undefined, 'Block') // -> 'Block Mix'
 * // TODO: подумать тут названием аргумента и поправить в доке
 * @param strings ClassNames strings.
 * @return Merged string.
 */
export function classnames(...strings: Array<string | undefined>): string {
  let className = ''
  const uniqueCache = new Set()
  const classNameList = strings.join(' ').split(' ')

  for (const value of classNameList) {
    if (value === '' || uniqueCache.has(value)) {
      continue
    }

    uniqueCache.add(value)

    if (className.length > 0) {
      className += ' '
    }

    className += value
  }

  return className
}
