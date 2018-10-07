# eslint-plugin-nested-ternaries

Mutliline ternaries are great, even nested

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-nested-ternaries`:

```
$ npm install eslint-plugin-nested-ternaries --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-nested-ternaries` globally.

## Usage

Add `nested-ternaries` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "nested-ternaries"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "nested-ternaries/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here

