# Connect BEM React Core using CDN links

This document describes how to connect pre-compiled bem-react-core library files to CDN and how to work with the library without using the build.

## Connecting the library

To connect the bem-react-core library, create a local HTML file and copy the following links into the HTML code of the page:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/bem-react-core@1.0.0-rc.8/umd/react.js"></script>
```

## Working with the library

After connecting pre-compiled files, the bem-react-core library is available as a `BemReactCore` object.

To declare components and modifiers, use the `BemReactCore.decl()` and `BemReactCore.declMod()` object methods.

The example shows the declaration of the `Button` block with the `disabled` modifier:

```html
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

To generate CSS classes based on component declarations without the build, use the `applyDecls()` function.

```html
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

    ReactDOM.render(
      React.createElement(Button.applyDecls(), { disabled: true }, 'Click me!'),
      document.getElementById('root')
    );

  </script>
</body>
```

In order to view the result, open the modified HTML file in a browser.

> * [Complete code of the HTML file](https://gist.github.com/innabelaya/72a611a67d151e6eda6d942c94f21bdc)
> * [Project in JSFiddle](http://jsfiddle.net/awinogradov/ek5esy89/)
