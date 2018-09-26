# eslint-plugin-strict-ternaries

Mutliline ternaries are great, even nested

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-strict-ternaries`:

```
$ npm install eslint-plugin-strict-ternaries --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-strict-ternaries` globally.

## Usage

Add `strict-ternaries` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "strict-ternaries"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "strict-ternaries/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





