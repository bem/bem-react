# Подключаем BEM React Core ссылками с CDN

Документ описывает, как подключать предсобранные файлы библиотеки bem-react-core с CDN и как работать с библиотекой, не используя сборку.

-----------------

## Подключение библиотеки

Чтобы подключить библиотеку bem-react-core, создайде локально HTML-файл и скопируйте следующие ссылки в HTML-код страницы:

```
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/prop-types/prop-types.min.js"></script>
<script src="https://unpkg.com/bem-react-core@1.0.0-rc.8/umd/react.js"></script>
```

## Работа с библиотекой

После подключения предсобранных файлов библиотека bem-react-core доступна в виде объекта `BemReactCore`. 

Чтобы декларировать компоненты и модификаторы, используйте методы объекта `BemReactCore.decl()` и `BemReactCore.declMod()`.

В примере показана декларация блока `Button` с модификатором `disabled`:

```
<body>
  <div id="root"></div>
  <script>

    var Button = BemReactCore.decl({
      block: 'Button',
      tag: 'button',
      attrs: { type: 'submit' }
    });

    BemReactCore.declMod({ disabled: true }, {
        block: 'Button',
        attrs: { disabled: 'disabled' }
    });

  </script>
</body>
```

Чтобы генерировать CSS-классы по декларациям компонентов без сборки, используйте функцию `applyDecls()`.

```
  <body>
    <div id="root"></div>
    <script>

      var Button = BemReactCore.decl({
        block: 'Button',
        tag: 'button',
        attrs: { type: 'submit' }
      });

      BemReactCore.declMod({ disabled: true }, {
          block: 'Button',
          attrs: { disabled: 'disabled' }
      });

+      ReactDOM.render(
+        React.createElement(Button.applyDecls(), { disabled: true }, 'Click me!'),
+        document.getElementById('root')
+      );

    </script>
  </body>
```

Чтобы посмотреть результат, откройте измененный HTML-файл в браузере.

> * [Полный код HTML-файла](https://gist.github.com/innabelaya/72a611a67d151e6eda6d942c94f21bdc)
> * [Проект в JSFiddle](http://jsfiddle.net/awinogradov/ek5esy89/) с использованием `props`.

Рекомендуем использовать описанный выше способ работы с библиотекой только в ознакомительных целях. Чтобы создать полноценное приложение для production-режима, ознакомьтесь с руководством по установке:
* [Как развернуть новый проект на bem-react-core](./CreateNewProject.md)
* [Как добавить bem-react-core в существующий проект]()
