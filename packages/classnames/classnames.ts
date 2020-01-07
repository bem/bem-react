/**
 * Generate className string with unique tokens.
 *
 * @example
 * classnames('Button', 'Header-Button', undefined) // -> Button Header-Button
 *
 * @param tokens ClassNames tokens.
 */
export function classnames(...tokens: Array<string | undefined>): string {
  let className = ''
  const uniqueCache = new Set()
  const classNameList = tokens.join(' ').split(' ')

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
