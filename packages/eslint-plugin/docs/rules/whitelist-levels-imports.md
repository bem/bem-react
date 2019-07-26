# @bem-react/whitelist-levels-imports

This rule is needed to check imports according to redefinition levels whitelist.

## Options

This rule has three options.

### `whiteList` (required)

For example, in a project with three redefinition levels — `common`, `desktop` and `mobile`, you want to allow imports:

* at `common` level only from `common` level
* at `desktop` level from `common` and `desktop` levels
* at `mobile` level from `common` and `mobile` levels

Also you want to disallow imports:

* at `common` level from `desktop` and `mobile` levels
* at `desktop` level from `mobile` level
* at `mobile` level from `desktop` level

You can describe similar restrictions using `whiteList` option:

```json
"whiteList": {
    "common": ["common"],
    "desktop": ["common", "desktop"],
    "mobile": ["common", "mobile"]
}
```

Now at `common` redefinition level you can import only from `common` level.

```js
// Button@common.tsx

import { Icon } from '../Icon/Icon'; // Good
import { Icon } from '../Icon/Icon@common'; // Good
import { Icon } from '../Icon/Icon@mobile'; // No, it's wrong!
import { Icon } from '../Icon/Icon@desktop'; // No, it's wrong!
```

At `desktop` redefinition level you can import from `common` and `desktop` levels, but not from `mobile` level.

```js
// Button@desktop.tsx

import { Icon } from '../Icon/Icon'; // Good
import { Icon } from '../Icon/Icon@common'; // Good
import { Icon } from '../Icon/Icon@desktop'; // Good
import { Icon } from '../Icon/Icon@mobile'; // No, it's wrong!
```

And at `mobile` redefinition level you can import from `common` and `mobile` levels, but not from `desktop` level.

```js
// Button@mobile.tsx

import { Icon } from '../Icon/Icon'; // Good
import { Icon } from '../Icon/Icon@common'; // Good
import { Icon } from '../Icon/Icon@mobile'; // Good
import { Icon } from '../Icon/Icon@desktop'; // No, it's wrong!
```

### `defaultLevel` (required)

The linter tries to determine a redefinition level of a file by it's filename. So for files like `Icon@desktop.tsx` and `Icon@desktop.example.tsx`, the redefinition level is `desktop`. For a file `mobile.tsx` the level is `mobile`, but only if this level is specified in the `whiteList` setting.

If the linter could not determine a redefinition level by a filename, it accepts that level is a value of `defaultLevel` setting. In most project this setting has a `common` value, but you can use other, like `base` or like that.

### `ignorePaths` (optional)

Additionally you can ignore some files, use `ignorePaths` option. For example:

```json
"ignorePath": [
    ".example.tsx$",
    ".example.jsx$"
]
```

## Further Reading

* [Redefinition levels](https://en.bem.info/methodology/redefinition-levels/)
* [Dependency Injection](https://en.bem.info/technologies/bem-react/di/)
