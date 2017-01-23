# How to contribute

1. [Create an issue](https://github.com/bem/bem-react-core/issues/new) with a proper description.
2. Decide which version needs your changes.
3. Create a feature-branch with an issue number and a version (`issues/<issue_number>@v<version_number>`) based on a version branch.
   For example, for an issue #42 and a version #1: `git checkout -b issues/42@v1 v1`.
   If you need changes for several versions, each of them has to have a feature branch.
4. Commit changes and `push`. Rebase your branch on a corresponding version branch if it's needed.
5. Create a pull-request from your feature branch; or several pull-requests if you changed several versions.
6. Link your pull request with an issue number any way you like. A comment will work perfectly.
7. Wait for your pull request and the issue to be closed ;-)

## Contributors

The list of contributors is available at https://github.com/bem/bem-react-core/graphs/contributors. You may also get it with `git log --pretty=format:"%an <%ae>" | sort -u`.
