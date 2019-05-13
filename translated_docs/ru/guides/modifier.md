---
id: modifier
title: Модифиакатор
---

## Мотивация

описать, что такое модификатор, и зачем он нужен

## Пример использования

Чтобы создать модификатор, необходимо воспользоваться функцией `withBemMod` из пакета `@bem-react/core`.

Модификатор является компонентом высшего порядка (HOC) который включается динамически в зависимости от переданного свойства.

<!-- TODO: не блок, а компонент? -->

Для начала создадим базовую реализацию блока и использованием функции `cn` для построения `className`:

> **Примечание:** Важно, чтобы базовый блок реализовывал интерфейс `className`, чтобы класс модификатора в дальнейшем попал на него.

```jsx
// src/components/Button/Button.tsx
export type ButtonProps = {
  children?: ReactNode
  className?: string
  addonAfter?: ReactNode
}

export const cnButton = cn('Button')

export const Button: FC<ButtonProps> = ({
  className,
  children,
  addonAfter,
}) => (
  <button className={cnButton({}, [className])}>
    {children}
    {addonAfter}
  </button>
)
```

Далее создаем модификатор:

> **Примечание:** Обязательно создаем интерфейс модификатора, чтобы в дальнейшем иметь валидацию и подсказки при написании кода.

```jsx
// src/components/Button/_size/Button_size_medium.tsx
export type WithSizeMediumProps = {
  size?: 'medium'
}

export const withSizeMedium =
  withBemMod<WithSizeMediumProps>(cnButton(), { size: 'medium' })
```

Создание компонента с модификатором:

> **Примечание:** Для создания компонента с более чем одним модификатором рекомендуется использовать функцию `compose` из пакета `@bem-react/core`, чтобы правильно получить входные типы.

```jsx
export const ButtonEnhanced = withSizeMedium(Button)
```

Использование в приложении:

```jsx
const App = () => (
  <ButtonEnhanced size="medium">
    Нажми меня
  </ButtonEnhanced>
)
```

[Попробовать](https://codesandbox.io)

<!-- TODO: Подумать как лучше назвать -->

## Сложный модификатор

Бывает необходимость создать более сложный модификатор, чтобы это сделать есть возможность передать (???) в качестве третьего аргумента в функцию `withBemMod`:

```jsx
// src/components/Button/_icon/Button_icon.tsx
export type WithIconProps = {
  icon?: string
}

export const withIcon =
  withBemMod<WithIconProps>(cnButton(), { icon: '*' }, (WrappedComponent) => (
    ({ icon, ...props }) => (
      <WrappedComponent
        {...props}
        addonAfter={<Icon type={icon} />}
      />
    ))
  )
```
