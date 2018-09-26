# Have ternaries follow typical if/else indent style (indent-ternaries)

Please describe the origin of the rule here.


## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
const foo = test
  ? value
  : otherTest
    ? otherValue
    : fallback
```

Examples of **correct** code for this rule:

```js
const foo =
  test ?
    value
  : otherTest ?
    isMoreSpecific ?
      specific
    :
      otherValue
  :
    fallback
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
