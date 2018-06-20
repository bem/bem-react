# Motivation

This document addresses issues that web developers face on a daily basis. We describe solutions using the current implementation of [React](https://reactjs.org/) and explain why these are not optimal approaches. The bem-react-core library offers effective alternative solutions to these problems thanks to the use of [redefinition levels](https://en.bem.info/methodology/redefinition-levels/) and declarative control of [block modification](https://en.bem.info/methodology/block-modification/).

* [Decomposition](#decomposition)
* [Code reuse](#code-reuse)
* [Cross-platform development](#cross-platform-development)
* [Experiments](#experiments)
* [Interaction between a shared component library and different projects](#interaction-between-a-shared-component-library-and-different-projects)

## Decomposition

A web component is designed for multiple tasks. As a result, its functionality is overly complex and it has a large number of possible variations. Component variations are usually expressed with custom imperative conditions in the code. However, code with a large number of `if` or `switch` statements makes it difficult to quickly evaluate all the features of a component, change a component, or create the desired combination of conditions to execute at runtime.

Besides, the main logic of the React component is included in the `render()` method. This means that in order to move or redefine a component's functionality, you have to rewrite a large part of the method.

## Code reuse

The number of components in use is constantly growing, and their functionality is also becoming more complex. Components have shared code that needs to be reused.

The current implementation of React suggests using classical inheritance or [High Order Components](https://reactjs.org/docs/higher-order-components.html) for code reuse.

Inheritance does not allow combining multiple orthogonal features without completely redesigning the class hierarchy. It also has a number of [well-known](https://en.wikipedia.org/wiki/Composition_over_inheritance) problems.

## Cross-platform development

Cross-platform compatibility is one of the main requirements for a web project. In order to support multiple platforms, developers usually create a separate version for each platform or develop a single adaptive version.

The development of individual versions requires additional resources: the more platforms you need to support, the more effort is spent on development. Even if your project has enough resources to develop multiple versions, it will be difficult to keep the product properties synced between different versions. In addition, having different versions increases the challenges of code reuse.

Developing an adaptive version makes the code more complex and requires highly skilled developers. Another common problem with adaptive versions is that performance suffers, especially on mobile devices.

## Experiments

In order to develop projects for a large audience, you have to be confident in every change. A/B experiments are one way to get that confidence.

The most common ways to organize code for conducting experiments:

* Branch the entire code base and create separate instances of the service.
* Add point conditions within the scope of a single code base.

If a project contains a lot of lengthy experiments, branching the code base may incur significant additional expenses. Each experimental branch must be kept up to date and synced with changes such as bug fixes and new product functionality. In addition, branching the code base makes it more difficult to conduct overlapping experiments.

Point conditions within the scope of a single code base are more flexible, but they also add to the complexity of the code base itself: experimental conditions may affect different parts of the project's core code. It is difficult for anyone to understand code that has a large number of conditions. This also worsens performance by increasing the amount of code for the browser to process. After each experiment, you need to delete the extra code: remove the conditions and make the code core, or completely remove the unsuccessful experiment.

## Interaction between a shared component library and different projects

In order to use a shared component library in a project, you need to interact with its source code. For example, you can change the API, improve and optimize the code, or add functionality.

There are several ways to make changes to library components for your project:

* Fork the library.
* Use inheritance.
* Patch the library code in runtime.

When a library is forked, you need to track updates in the upstream and apply patches.

Inheritance is used if you need to retrieve a modified component from the library. For example, you can create a `MyButton` component that inherits from `Button` in the library. But the inherited `MyButton` does not apply to all components from the library that contain buttons. For example, the library may have a `Search` component that is a combination of `Input` and `Button`. In this case, the inherited `MyButton` will not appear inside the `Search` component.

It is not possible to patch the library code in runtime if the library authors did not provide a mechanism for external changes.

