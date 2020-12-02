const replacer = (packageName, experiments, path) => {
  // если импорт не целевая бибилотека или содержит эксперимент, то пропускам
  if (path.indexOf(packageName) !== 0 || path.indexOf(`${packageName}/experiments`) === 0) {
    return path
  }

  const blocks = Object.keys(experiments)

  for (let block of blocks) {
    const blockPath = block === '*' ? '' : `/${block}/`
    const expName = experiments[block]
    const pathMatcher = `${packageName}${blockPath}`

    if (!path.startsWith(pathMatcher)) continue

    return path.replace(pathMatcher, `${packageName}/experiments/${expName}${blockPath}`)
  }

  return path
}

module.exports = replacer
