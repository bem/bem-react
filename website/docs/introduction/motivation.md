---
id: motivation
title: Why BEM if there's React?
---

This document covers tasks that web developers face every day. We describe how they are solved in [React](https://reactjs.org/) today and explain why those solutions are suboptimal. The bem-react-core library offers alternative solutions that are more efficient thanks to [redefinition levels](https://en.bem.info/methodology/redefinition-levels/) and the ability to declaratively manage [block modification](https://en.bem.info/methodology/block-modification/).

* [Decomposition](#decomposition)
* [Code reuse](#code-reuse)
* [Cross-platform development](#cross-platform-development)
* [Experiments](#experiments)
* [Sharing a component library across projects](#sharing-a-component-library-across-projects)

## Decomposition

A web component has to solve many tasks. As a result, its functionality grows more complex and the number of possible variations increases. This variability is usually expressed with arbitrary imperative conditions in code. A large number of `if` or `switch` statements makes it hard to quickly grasp everything the component can do, to modify it, or to produce the right combination of conditions evaluated at runtime.

Besides that, most of a React component's logic lives in the `render()` method. So moving or overriding a component's functionality means rewriting most of that method.

## Code reuse

The number of components keeps growing, and their functionality gets more complex. Components start to share common code that needs to be reused.

For code reuse, React today offers [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html) or classic inheritance.

Inheritance doesn't let you combine several orthogonal features without completely redesigning the class hierarchy, and it comes with a number of [well-known](https://en.wikipedia.org/wiki/Composition_over_inheritance) problems.

## Cross-platform development

Cross-platform support is one of the core requirements for a web project. To support multiple platforms, teams usually either build a separate version for each platform or develop a single responsive version.

Building separate versions takes extra resources: the more platforms you need to support, the more effort development takes. Even if the project has enough resources to develop several versions, keeping product features in sync across them adds extra complexity. Having different versions also aggravates the code reuse problem.

A responsive version complicates the code and raises the skill requirements for developers. Another common problem with responsive versions is degraded performance, especially on mobile devices.

## Experiments

Developing a project for a large audience requires confidence in every change. A/B experiments are one way to gain that confidence.

The most common ways to organize code for experiments are:
* branching the entire codebase and running separate service instances
* targeted conditionals within a single codebase

If a project runs many long-lived experiments, branching the codebase can incur significant extra costs. Every experiment branch has to be kept up to date, with changes (bug fixes, product features) synchronized. Branching also makes overlapping experiments harder to run.

Targeted conditionals within a single codebase are more flexible but complicate the codebase itself: experiment conditions may touch different parts of the project's core code. A large number of conditions makes the code harder for humans to understand and hurts performance by increasing the amount of code shipped to the browser. After every experiment, the extra code has to be removed: either drop the conditions and make the code permanent, or delete the failed experiment entirely.

## Sharing a component library across projects

To use a shared component library in a project, you need to interact with its source code. For example, to change the API, improve and optimize the code, or add functionality.

There are several ways to modify library components for your project:
* forking the library
* inheritance
* patching the library code at runtime

With a fork, you have to track upstream updates and apply patches.

Inheritance is used when you need a modified version of a library component. For example, you can create a `MyButton` component that inherits from the library's `Button`. But the inherited `MyButton` won't be applied to all library components that contain buttons. For example, the library may have a `Search` component built as a composition of `Input` and `Button`. In that case, the inherited `MyButton` won't appear inside the `Search` component.

Patching library code at runtime is impossible unless the library authors have provided a way to make external changes.
