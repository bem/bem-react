# Внесение изменений

Bem React Core является библиотекой с открытым исходным кодом, которая находится в стадии активной разработки, а также используется внутри компании [Яндекс](https://yandex.ru/company/).

Вся работа над Bem React Core ведется непосредственно на GitHub. Как члены основной группы, так и внешние участники отправляют [Pull Requests](https://github.com/bem/bem-react-core/pulls), которые проходят один и тот же процесс проверки.

Разработка ведется в ветках. Основная ветка — `master`. Код, находящийся в ветке `master`, покрыт тестами и рекомендуется к использованию. 

Чтобы внести изменения:

1. [Создайте issue](#Создание-issue)
2. [Отправьте Pull Request](#Отправка-pull-requestа)

## Создание issue

Если вы нашли ошибку или желаете внести улучшение в API:

1. Проверьте нет ли аналогичной задачи в [списке задач](https://github.com/bem/bem-react-core/issues).
2. Если задачи нет — [создайте новую](https://github.com/bem/bem-react-core/issues/new) с описанием проблемы.

> **Примечание.** Считается хорошим тоном делать описания на английском языке.

## Отправка Pull Request'а

Для внесения изменений в библиотеку выполните следующие действия:

1. Создайте ответвление (fork).
2. Склонируйте ответвление.

    ```bash
    $ git clone git@github.com:<логин-пользователя>/bem-react-core.git
    ```

3. Добавьте основной репозиторий библиотеки `bem-react-core` как удаленный (remote) с названием «upstream».

    ```bash
    $ cd bem-react-core
    $ git remote add upstream git@github.com:bem/bem-react-core.git
    ```

4. Получите последние изменения.

    ```bash
    $ git fetch upstream
    ```

    > **Примечание.** Выполняйте этот шаг перед каждым внесением изменений, чтобы быть уверенным, что работаете с кодом, содержащим последние изменения.

5. Создайте `feature-branch` с указанием номера [созданной задачи](#Создание-issue).

    ```bash
    $ git checkout upstream/master
    $ git checkout -b issue-<номер задачи>
    ```

6. Внесите изменения.
7. Зафиксируйте изменения комментарием, оформленным в соответствии c соглашением [Conventional Commits](https://conventionalcommits.org).

    ```bash
    $ git commit -m "<type>[optional scope]: <description>"
    ```

8. Получите последние изменения.

    ```bash
    $ git pull --rebase upstream master
    ```

9. Отправьте изменения на GitHub.
    
    ```bash
    $ git push -u origin issue-<номер issue>
    ```
    
10. Пришлите [Pull Request](https://github.com/bem/bem-react-core/compare) на основе созданной ветки.
11. Свяжите Pull Request и issue (например, c помощью комментария).
12. Ожидайте решения о принятии изменений.
