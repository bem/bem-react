## Decomposition is not easy

Nowadays components become so complex and variative. Usually, all variations are impressed in a code as a lot of custom imperative `if`'s. Maintaining such code is not so easy:
- it's hard to understand all possible variations
- the logic of particular functionality can be spread through many different places inside the code, that complicates the process of changes and extending

Moreover, usual `render` method contains almost all logic of the component. It's hard to move, extend and partially override such code, because of the necessity of rewriting massive part of `render` method.

If you have optional variations than writing everything in one file will unavoidably lead to bloating your static bundle size. There is no easy way to "tell" to your build system which exactly parts we need in a particular case.

## Code reuse is not easy

The number of components is growing and they become more complex. There is the common code between them. We would like to reuse such common parts easily. Now there are two popular ways: classic inheritance and High Order Components.

With classic inheritance, it's hard to combine several orthogonal features without full redesigning of classes hierarchy. Furthermore, it has the whole bunch of problems which [was discussed many times](https://en.wikipedia.org/wiki/Composition_over_inheritance).

In case of High Order Components, the composition of several different components, which are responsible for different aspects of functionality, will lead you to bloat virtual tree. Moreover, you often need to use `React.cloneElement`.