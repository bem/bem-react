import React from 'react'
import { mount } from 'enzyme'
import { cn } from '@bem-react/classname'

import { withBemMod, IClassNameProps } from '../core'

const getClassNameFromSelector = (Component: React.ReactElement<any>, selector: string = 'div') =>
  mount(Component)
    .find(selector)
    .prop('className')

interface IPresenterProps extends IClassNameProps {
  theme?: 'normal'
  view?: 'default'
  url?: string
}

const presenter = cn('Presenter')

const Presenter: React.FC<IPresenterProps> = ({ className }) => (
  <div className={presenter({}, [className])} />
)

describe('withBemMod', () => {
  test('should not affect CSS class with empty object', () => {
    const WBCM = withBemMod<IPresenterProps>(presenter(), {})(Presenter)
    expect(getClassNameFromSelector(<WBCM className="Additional" />)).toEqual(
      'Presenter Additional',
    )
  })

  test('should add modifier class for matched prop', () => {
    const Enhanced1 = withBemMod<IPresenterProps>(presenter(), { theme: 'normal' })(Presenter)
    const Enhanced2 = withBemMod<IPresenterProps>(presenter(), { view: 'default' })(Enhanced1)
    const Component = <Enhanced2 className="Additional" theme="normal" view="default" />

    expect(getClassNameFromSelector(Component)).toEqual(
      'Presenter Presenter_theme_normal Presenter_view_default Additional',
    )
  })

  test('should not add modifier class for star matched prop', () => {
    const Enhanced1 = withBemMod<IPresenterProps>(presenter(), { url: '*' })(Presenter)
    const Component = <Enhanced1 className="Additional" url="ya.ru" />

    expect(getClassNameFromSelector(Component)).toEqual('Presenter Additional')
  })

  test('should match on star matched prop', () => {
    const Enhanced1 = withBemMod<IPresenterProps>(presenter(), { url: '*' }, (Base) => (props) => (
      <Base {...props} className="Additional" />
    ))(Presenter)
    const Component = <Enhanced1 url="ya.ru" />

    expect(getClassNameFromSelector(Component)).toEqual('Presenter Additional')
  })

  test('should not add modifier class for unmatched prop', () => {
    const WBCM = withBemMod<IPresenterProps>(presenter(), { theme: 'normal' })(Presenter)
    expect(getClassNameFromSelector(<WBCM className="Additional" />)).toEqual(
      'Presenter Additional',
    )
  })

  test('should not initialized after change props', () => {
    const init = jest.fn()
    const Enhanced = withBemMod<IPresenterProps>(
      presenter(),
      { theme: 'normal' },
      (WrappedComponent) =>
        class WithEnhanced extends React.PureComponent {
          constructor(props: IPresenterProps) {
            super(props)
            init()
          }

          render() {
            return <WrappedComponent {...this.props} />
          }
        },
    )(Presenter)

    mount(<Enhanced theme="normal" />).setProps({ disabled: true })
    expect(init).toHaveBeenCalledTimes(1)
  })
})
