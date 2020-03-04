import { classnames } from '../classnames'

describe('@bem-react/classnames', () => {
  describe('classnames', () => {
    test('empty', () => {
      expect(classnames()).toEqual('')
    })

    test('undefined', () => {
      expect(classnames('Block', undefined, 'Block2')).toEqual('Block Block2')
    })

    test('uniq', () => {
      expect(classnames('CompositeBlock', 'Block', 'Test', 'Block')).toEqual(
        'CompositeBlock Block Test',
      )
    })
  })
})
