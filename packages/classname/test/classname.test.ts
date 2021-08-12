import { cn, withNaming } from '../classname'

describe('@bem-react/classname', () => {
  describe('cn', () => {
    test('block', () => {
      const b = cn('Block')
      expect(b()).toEqual('Block')
    })

    test('elem', () => {
      const e = cn('Block', 'Elem')
      expect(e()).toEqual('Block-Elem')
    })

    describe('modifiers', () => {
      test('block', () => {
        const b = cn('Block')
        expect(b({ modName: true })).toEqual('Block Block_modName')
      })

      test('elem', () => {
        const e = cn('Block', 'Elem')
        expect(e({ modName: true })).toEqual('Block-Elem Block-Elem_modName')
      })

      test('more than one', () => {
        const mods = { modName: true, modName2: 'modVal' }
        const b = cn('Block')
        const e = cn('Block', 'Elem')

        expect(b(mods)).toEqual('Block Block_modName Block_modName2_modVal')
        expect(e(mods)).toEqual('Block-Elem Block-Elem_modName Block-Elem_modName2_modVal')
      })

      test('multi-valued mod', () => {
        const mods = { modName: ['modValA', 'modValB'] }
        const b = cn('Block')
        const e = cn('Block', 'Elem')

        expect(b(mods)).toEqual('Block Block_modName_modValA Block_modName_modValB')
        expect(e(mods)).toEqual('Block-Elem Block-Elem_modName_modValA Block-Elem_modName_modValB')
      })

      test('empty', () => {
        const b = cn('Block')
        expect(b({})).toEqual('Block')
      })

      test('falsy', () => {
        const b = cn('Block')
        expect(b({ modName: false })).toEqual('Block')
      })

      test('with falsy', () => {
        const b = cn('Block', 'Elem')
        expect(b({ modName: false, mod: 'val' })).toEqual('Block-Elem Block-Elem_mod_val')
      })

      test('zero', () => {
        const b = cn('Block')
        expect(b({ modName: '0' })).toEqual('Block Block_modName_0')
      })

      test('undefined', () => {
        const b = cn('Block')
        expect(b({ modName: undefined })).toEqual('Block')
      })
    })

    describe('mix', () => {
      test('block', () => {
        const b = cn('Block')
        expect(b(null, ['Mix1', 'Mix2'])).toEqual('Block Mix1 Mix2')
      })

      test('block with mods', () => {
        const b = cn('Block')
        expect(b({ theme: 'normal' }, ['Mix'])).toEqual('Block Block_theme_normal Mix')
      })

      test('elem', () => {
        const e = cn('Block', 'Elem')
        expect(e(null, ['Mix1', 'Mix2'])).toEqual('Block-Elem Mix1 Mix2')
      })

      test('elem with mods', () => {
        const e = cn('Block', 'Elem')
        expect(e({ theme: 'normal' }, ['Mix'])).toEqual('Block-Elem Block-Elem_theme_normal Mix')
      })

      test('carry elem', () => {
        const b = cn('Block')
        expect(b('Elem', ['Mix1', 'Mix2'])).toEqual('Block-Elem Mix1 Mix2')
      })

      test('carry elem with mods', () => {
        const b = cn('Block')
        expect(b('Elem', { theme: 'normal' }, ['Mix'])).toEqual(
          'Block-Elem Block-Elem_theme_normal Mix',
        )
      })

      test('carry elem with multi-valued mod', () => {
        const b = cn('Block')
        expect(b('Elem', { theme: ['normal', 'light'] }, ['Mix'])).toEqual(
          'Block-Elem Block-Elem_theme_normal Block-Elem_theme_light Mix',
        )
      })

      test('undefined', () => {
        const b = cn('Block')
        expect(b('Elem', null, [undefined])).toEqual('Block-Elem')
      })

      /** @see https://github.com/bem/bem-react/issues/445 */
      test('not string and not undefined', () => {
        const b = cn('Block')
        expect(b('Elem', null, [false as any])).toEqual('Block-Elem')
        expect(b('Elem', null, [true as any])).toEqual('Block-Elem')
        expect(b('Elem', null, [10 as any])).toEqual('Block-Elem')
        expect(b('Elem', null, [null as any])).toEqual('Block-Elem')
      })

      test('unique block', () => {
        const b = cn('Block')
        expect(b(null, ['Block'])).toEqual('Block')
      })

      test('unique block with mods', () => {
        const b = cn('Block')
        expect(b({ theme: 'normal' }, ['Block Block_size_m'])).toEqual(
          'Block Block_theme_normal Block_size_m',
        )
      })

      test('unique elem', () => {
        const b = cn('Block')
        expect(b('Elem', null, ['Block-Elem'])).toEqual('Block-Elem')
      })

      test('unique elem with mods', () => {
        const b = cn('Block')
        expect(b('Elem', { theme: 'normal' }, ['Block-Elem Block-Elem_size_m'])).toEqual(
          'Block-Elem Block-Elem_theme_normal Block-Elem_size_m',
        )
      })

      test('object with valueOf', () => {
        const b = cn('Block')
        expect(b('Elem', null, [{ valueOf: () => 'Mix' } as string])).toEqual('Block-Elem Mix')
      })
    })
  })

  describe('withNaming origin preset', () => {
    const cCn = withNaming({
      e: '__',
      m: '_',
    })

    test('block', () => {
      const b = cCn('block')
      expect(b()).toEqual('block')
    })

    test('elem', () => {
      const e = cCn('block', 'elem')
      expect(e()).toEqual('block__elem')
    })

    describe('modifiers', () => {
      test('block', () => {
        const b = cCn('block')
        expect(b({ modName: true })).toEqual('block block_modName')
      })

      test('elem', () => {
        const e = cCn('block', 'elem')
        expect(e({ modName: true })).toEqual('block__elem block__elem_modName')
      })

      test('more than one', () => {
        const mods = { modName: true, modName2: 'modVal' }
        const b = cCn('block')
        const e = cCn('block', 'elem')

        expect(b(mods)).toEqual('block block_modName block_modName2_modVal')
        expect(e(mods)).toEqual('block__elem block__elem_modName block__elem_modName2_modVal')
      })

      test('multi-valued mod', () => {
        const mods = { modName: ['modValA', 'modValB'] }
        const b = cCn('block')
        const e = cCn('block', 'elem')

        expect(b(mods)).toEqual('block block_modName_modValA block_modName_modValB')
        expect(e(mods)).toEqual(
          'block__elem block__elem_modName_modValA block__elem_modName_modValB',
        )
      })

      test('empty', () => {
        const b = cCn('block')
        expect(b({})).toEqual('block')
      })

      test('falsy', () => {
        const b = cCn('block')
        expect(b({ modName: false })).toEqual('block')
      })

      test('with falsy', () => {
        const b = cCn('block')
        expect(b({ modName: false, mod: 'val' })).toEqual('block block_mod_val')
      })

      test('zero', () => {
        const b = cCn('block')
        expect(b({ modName: '0' })).toEqual('block block_modName_0')
      })
    })
  })

  describe('withNaming custom preset', () => {
    const customCn = withNaming({
      e: '__',
      m: '--',
      v: '_',
    })

    test('variants', () => {
      const block = customCn('block')

      expect(block({ mod: true })).toEqual('block block--mod')
      expect(block({ mod: false })).toEqual('block')
      expect(block({ mod: 'value' })).toEqual('block block--mod_value')
      expect(block('element', { mod: true })).toEqual('block__element block__element--mod')
      expect(block('element', { mod: false })).toEqual('block__element')
      expect(block('element', { mod: 'value' })).toEqual('block__element block__element--mod_value')
      expect(block('element', { mod: ['valueA', 'valueB'] })).toEqual(
        'block__element block__element--mod_valueA block__element--mod_valueB',
      )
    })
  })

  describe('carry', () => {
    test('alone', () => {
      const e = cn('Block')
      expect(e('Elem')).toEqual('Block-Elem')
    })

    test('with mods', () => {
      const e = cn('Block')
      expect(e('Elem', { modName: true })).toEqual('Block-Elem Block-Elem_modName')
    })

    test('with elemMods', () => {
      const e = cn('Block', 'Elem')
      expect(e({ modName: true })).toEqual('Block-Elem Block-Elem_modName')
    })
  })
})
