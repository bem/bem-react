# Создаем новый проект на bem-react-core

Документ описывает, как развернуть проект на bem-react-core с нуля с помощью шаблонного репозитория [bem-react-boilerplate](https://github.com/bem/bem-react-boilerplate). В документе по шагам создается одностраничное приложение.
Не рассматриваются вопросы интеграции приложения с бекэндом.

----------------

## Общие сведения

Самый быстрый и простой способ создать проект на bem-react-core — воспользоваться шаблонным репозиторием [bem-react-boilerplate](https://github.com/bem/bem-react-boilerplate).

bem-react-boilerplate создан на основе [Create React App](https://github.com/facebookincubator/create-react-app) и [React App Rewired](https://github.com/timarney/react-app-rewired).

Чтобы начать разрабатывать приложение, достаточно установить его локально. Настраивать сборку не нужно, так как проект уже включает все необходимые настройки webpack.

* Общие сведения
* Установка
  * Файловая структура проекта
* Hello World!
* Создаем приложение tick tac toe
* Описание приложения
* Блоки
* Результат

## Установка

> Перед установкой убедитесь, что на вашем комьютере установлена последняя версия [Node.js](https://nodejs.org).

Клонируйте репозиторий [bem-react-boilerplate](https://github.com/bem/bem-react-boilerplate) и установите зависимости:

```bash
git clone git@github.com:bem/bem-react-boilerplate.git my-app
cd my-app
rm -rf .git
git init
npm i
```

Запустите сервер для разработки: 

```
npm start
```

Локально запустится сервер, который по умолчанию использует порт `3000`: `http://localhost:3000`.

После выполнения всех команд, вы получите локальную копию проекта на bem-react-core. 

### Файловая структура проекта

Разберем подробнее файловую структуру нового проекта: 

```
.bem/
node_modules/
public/
src/
    blocks/                   // Папка с блоками проекта
    index.js                  // Отправная точка вашего проекта
    registerServiceWorker.js
.babelrc
.bemrc.js
.editorconfig
.eslintrc.js
.gitignore
config-overrides.js
package-lock.json              //  это моментальный снимок всего дерева зависимостей, включающий все пакеты и их установленные версии.
package.json                   // описывает зависимости верхнего уровня от других пакетов
README.md
yarn.lock                      // содержит точные версии пакетов и их зависимости при первоначальной установке 
```

В обычном react-проекте все компоненты находятся в папке `src/`. В проекте, созданном с помощью bem-react-boilerplate, компоненты называются блоками и хранятся в папке `src/blocks/`.

Файл `src/index.js` это так называемя отправная точка нашего проекта. В нем указан элемент, от котрого будет строиться весь проект.

```jsx
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```

## Hello World!

Чтобы убедиться, что проект работает и настроен, что все изменения автоматичекси отображаются на странице, изменим все содержание блока `App` на надпись «Hello World!».

Для этого замените код из блока App на:

```
import { decl } from 'bem-react-core';

import Header from 'e:Header';

export default decl({
    block: 'hello',
    tag: 'h1',
    content() {
        return 'Hello World!';
    }
});
```

В результате на странице появится приветсвие, а в HTML-коде появится новый элемент c классом `hello`:

```
<h1 class='hello'>Hello World!</h1>
```

Теперь разберемся, как это работает.

## Перед началом работы

В шаблонном проекте реализовано два блока `App` и `Page`. Для игры крестики-нолики они нам не понадобятся, можно удалить папки. 

Чтобы создать игру нам понадобится три блока: `Square`, `Board` и `Game`.

Блок `Square` отвечает за генерацию отдельной кнопки. Блок `Board` рендерит 9 квадратов, которые представлены отдельными блоками (`Square`). Блок Game реднерит component renders a board with some placeholders that we’ll fill in later. None of the components are interactive at this point.


Значит в файле `src/index.js` укажем блок Game


### Блок Game
```
import React, {Fragment} from 'react';
import { decl } from 'bem-react-core';
import { Bem } from 'bem-react-core';
import Board from 'b:Board';

export default decl({
    block: 'Game',
    content() {
        return (
            <Fragment>
                <Bem elem="Board">
                    <Board/>
                </Bem>
            </Fragment>
        );
    }
});
```

Пока здесь будет только элемент, в который мы положим блок `Board`
Потом добавим сюда логику по работе с шагами и вывод статистики.

### Блок Square

Создадим блок `Square`, который отвечает за отображение кнопок.

В React он записан так: 

class Square extends React.Component {
  render() {
    return (
      <button className="square"></button>
    );
  }
}

В bem-react-core:

```
import { decl } from 'bem-react-core';

export default decl({
    block : 'Square',

    tag: 'button'
});
```

Передадим в блок `Square` данные. Props — это механизм передачи данных в реакте.
Все, что вы прописали в JSX для компонента в методе рендер, становится доступно у этого компонента через props. По сути props это простой JS-объект.
Props — это то, что приходит от родителя, на что в компоненте повлиять невозможно, а можно только использовать.

В блоке Board укажем, какое значение передавать для блока Square

```
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

В react он записан так: 

```
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

В bem-react-core:

```
import { decl } from 'bem-react-core';

export default decl({
    block : 'Square',

    tag: 'button',

    content({value}) {
        return value;
    }
});
```

### Блок Board

Основная логика работы нашей игры будет описана в блоке `Board`. 
Для начала напишем код, который создает саму площадку для игры: 

```
import React, {Fragment} from 'react';
import { Bem, decl } from 'bem-react-core';

import Square from 'b:Square'; // Указываем зависимость от блока Square

export default decl({
    block: 'Board',

    content() {

      return (
        <Fragment>
            {[                 
              this.renderRow(0),
              this.renderRow(1),
              this.renderRow(2)
            ]}
        </Fragment>
      );
    },

    renderRow(i) {                  // распределяем кнопки в ряды
        return <Bem elem="Row">{[
          this.renderSquare(i),
          this.renderSquare(i + 1),
          this.renderSquare(i + 2)
        ]}</Bem>
    },

    renderSquare(i) {
      return <Square value={i}></Square>;  // передаем значение в блок square
    }
});

```

#### Интерактивный компонент

Добавим функциональность - когда кликаешь на square, в нем отображается X 

В реакт компонентах Объект state описывает внутреннее состояние компонента, он похож на props за тем исключением, что состояние определяется внутри компонента и доступно только из компонента.  значения из state должны использоваться при рендеринге. и устанавливаются только в конструкторе.

Установим значения для каждого квадрата в state и будем изменять по клику.

Для начала добавим конструктор классу, чтобы инициализировать состояние.

React
```
class Square extends React.Component {
+  constructor(props) {
+    super(props);
+    this.state = {
+      value: null,
+    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

bem-react-core

в bem-react-core конструктор записывается с помощью метода: 

```
import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    willInit() {
        // original name: constructor
    },
```

код будет выглядеть так: 

```
export default decl({
    block: 'Board',

    willInit() {
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
```
Для react


















## Практическое применение

Созданный проект bem-react-core пока не поддерживает обрабоку серверной логики и не работает с базой данных; он просто создает конвейер сборки frontend, поэтому вы можете использовать его с любым бэкэндом, который вы хотите. Он использует инструменты сборки, такие как плагин для Babel и плагин для webpack под капотом, но работает с нулевой конфигурацией.

Когда вы будете готовы к развертыванию в производство, запуск сборки npm run приведет к созданию оптимизированной сборки вашего приложения в папке сборки. Вы можете узнать больше о Create React App из своего README и руководства пользователя.


> Подробное описание проекта и все базовые команды описаны в README проекта.

## Advanced: Установка вручную
Если вы предпочитаете вручную настраивать проект, читайте раздел «Установка вручную».


## Базовые команды ENB

## Полезные ссылки

* [Собираем статическую страницу на БЭМ](https://ru.bem.info/platform/tutorials/quick-start-static/)
* [Создаём свой проект на БЭМ](https://ru.bem.info/platform/tutorials/start-with-project-stub/)
* [Справочное руководство по BEMJSON](https://ru.bem.info/platform/bemjson/)
* [Руководство пользователя по BEMHTML](https://ru.bem.info/platform/bem-xjst/)
* [Пошаговое руководство по i-bem.js](https://ru.bem.info/platform/tutorials/i-bem/)











import { decl } from 'bem-react-core';

import Header from 'e:Header';

export default decl({
    block: 'hello',
    tag: 'h1',
    content() {
        return 'Hello World!';
    }
});


Результат:

<h1 class='hello'>Hello World!</h1>












