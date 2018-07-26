# Contributing

Bem React Core is an open source library that is under active development and is also used within [Yandex](https://yandex.com/company/).

All work on Bem React Core is done directly on GitHub. Members of the core group as well other participants send [Pull Requests](https://github.com/bem/bem-react-core/pulls) that go through the same verification process.

Development is carried out in branches. The main branch is `master`. The code in the `master`branch has been tested and is recommended for use.

To make changes:

1. [Create an issue](#creating-an-issue)
2. [Send your Pull Request](#sending-a-pull-request)

## Creating an issue

If you found a bug or want to make an improvement in the API:

1. First check whether the same issue already exists in the [list of issues](https://github.com/bem/bem-react-core/issues).
2. If you don't find the issue there, [create a new one](https://github.com/bem/bem-react-core/issues/new) including a description of the problem.

> **Note:** Languages other than English are not normally used in issue descriptions.

## Sending a Pull Request

To make changes to the library:

1. Fork the repository.
2. Clone the fork.

    ```bash
    $ git clone https://github.com/<username>/bem-react-core.git
    ```

3. Add the main repository for the `bem-react-core` library as a remote repository with the name "upstream".

    ```bash
    $ cd bem-react-core
    $ git remote add upstream https://github.com/bem/bem-react-core.git
    ```

4. Fetch the latest changes.

    ```bash
    $ git fetch upstream
    ```

    > **Note:** Repeat this step before every change you make, to be sure that you are working with code that contains the latest updates.

5. Create a `feature-branch` that includes the number of the [created issue](#creating-an-issue).

    ```bash
    $ git checkout upstream/master
    $ git checkout -b issue-<issue number>
    ```

6. Make changes.
7. Record the changes made by making comments in accordance with [Conventional Commits](https://conventionalcommits.org).

    ```bash
    $ git commit -m "<type>[optional scope]: <description>"
    ```

8. Fetch the latest changes.

    ```bash
    $ git pull --rebase upstream master
    ```

9. Send the changes to GitHub.

    ```bash
    $ git push -u origin issue-<issue number>
    ```

10. Send a [Pull Request](https://github.com/bem/bem-react-core/compare) based on the branch created.
11. Link the Pull Request and issue (for example, with a comment).
12. Wait for a decision about accepting the changes.
