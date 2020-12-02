const { it, describe } = require('@jest/globals')
const replacer = require('./replacer')

describe('replacer', () => {
  it('all matcher', async () => {
    const importPath = '@yandex-lego/components/Button/desktop'

    expect(replacer('@yandex-lego/components', { '*': 'css-modules' }, importPath)).toBe(
      '@yandex-lego/components/experiments/css-modules/Button/desktop',
    )
  })

  it('button only', async () => {
    const config = { Button: 'css-modules' }

    expect(
      replacer('@yandex-lego/components', config, '@yandex-lego/components/Button/desktop'),
    ).toBe('@yandex-lego/components/experiments/css-modules/Button/desktop')

    expect(
      replacer('@yandex-lego/components', config, '@yandex-lego/components/Select/desktop'),
    ).toBe('@yandex-lego/components/Select/desktop')
  })

  it('few experiments', async () => {
    const config = {
      Button: 'css-modules',
      Select: 'good-select',
    }

    expect(
      replacer('@yandex-lego/components', config, '@yandex-lego/components/Button/desktop'),
    ).toBe('@yandex-lego/components/experiments/css-modules/Button/desktop')

    expect(
      replacer('@yandex-lego/components', config, '@yandex-lego/components/Select/desktop'),
    ).toBe('@yandex-lego/components/experiments/good-select/Select/desktop')
  })

  it('first only', async () => {
    const config = {
      '*': 'make-lego-great-again',
      Button: 'css-modules',
    }

    expect(
      replacer('@yandex-lego/components', config, '@yandex-lego/components/Button/desktop'),
    ).toBe('@yandex-lego/components/experiments/make-lego-great-again/Button/desktop')
  })

  it('skip if experiment', async () => {
    const config = { '*': 'css-modules' }

    expect(
      replacer(
        '@yandex-lego/components',
        config,
        '@yandex-lego/components/experiments/some/Button/desktop',
      ),
    ).toBe('@yandex-lego/components/experiments/some/Button/desktop')
  })
})
