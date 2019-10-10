# @bem-react/no-classname-runtime

Do not use the @bem-react/classname function in runtime code

## Rule Details

The classname method from @bem-react/classname is often used and called in the hottest places, sometimes you can take it to the import level, then the result can be passed as a string literal directly to className= " x"

Examples of **incorrect** code for this rule:

```typescript jsx
// …
render() {
    return (
        {items.map((item, idx, arr) => (
            <div className={cn('Items')}>
                <div className={cn('Item')}>
                    ItemText
                </div>
            </div>
        )}
    )
}
```

Examples of **correct** code for this rule:

```typescript jsx
const cnItems = cn('Items');
const cnItem = cn('Item');

// …
render() {
    return (
        {items.map((item, idx, arr) => (
            <div className={cnItems}>
                <div className={cnItem}>
                    ItemText
                </div>
            </div>
        )}
    )
}
```
