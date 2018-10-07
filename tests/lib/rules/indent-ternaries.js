/**
 * @fileoverview Have ternaries follow typical if/else indent style
 * @author ngasull
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/indent-ternaries")
const RuleTester = require("eslint").RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } })
ruleTester.run("indent-ternaries", rule, {

  valid: [{
    code: "const foo = a ? b : c",
  }, {
    code: "const foo = (a) ? b : c",
    options: [{ testParens: "ignore" }],
  }, {
    code: "const foo = a ? (b) : c",
  }, {
    code: "const foo = a ? b : (c)",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    d\n\
  :\n\
    e\n\
",
  }, {
    code: "\n\
const foo =\n\
  a &&\n\
  aa ?\n\
    b\n\
  : c ?\n\
    d ?\n\
      e\n\
    : f ?\n\
      g\n\
    :\n\
      h\n\
  :\n\
    e\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    {\n\
      d: 'd',\n\
    }\n\
  :\n\
    e\n\
",
  }, {
    code: "\n\
const foo = {\n\
  bar:\n\
    a ?\n\
      b\n\
    :\n\
      c\n\
  }\n\
",
  }],

  invalid: [{
    code: "const foo = (a) ? b : c",
    errors: [{
      message: "There shouldn't be parens around test",
    }],
    output: "const foo = a ? b : c"
  }, {
    code: "\n\
  const foo = a ?\n\
      b\n\
    :\n\
      c\n\
",
    errors: [{
      message: "Multiline ternaries must start on a new line",
    }],
    output: "\n\
  const foo = \n\
    a ?\n\
      b\n\
    :\n\
      c\n\
",
  }, {
    code: "\n\
  const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
    errors: [{
      message: "Multiline ternaries must be indented",
    }],
    output: "\n\
  const foo =\n\
    a ?\n\
      b\n\
    :\n\
      c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a\n\
  ?\n\
    b\n\
  :\n\
    c\n\
",
    errors: [{
      message: "Test part of a ternary expression must be followed by question mark token (?) on the same line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ? b\n\
  :\n\
    c\n\
",
    errors: [{
      message: "Ternary expression's consequent must be indented on a new line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
  b\n\
  :\n\
    c\n\
",
    errors: [{
      message: "Ternary expression's consequent must be indented on a new line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b :\n\
      c\n\
",
    errors: [{
      message: "Ternary expression's consequent mustn't on the same line as colon token (:)",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
    :\n\
      c\n\
",
    errors: [{
      message: "Ternary expression's colon token must be aligned with the start of the ternary",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    c\n\
    :\n\
      d\n\
",
    errors: [{
      message: "Ternary expression's colon token must be aligned with the start of the ternary",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    c\n\
  :\n\
    d\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c\n\
",
    errors: [{
      message: "Ternary expression's alternate mustn't be on the same line as colon token (:)",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    c\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
  {\n\
    d: 'd',\n\
  }\n\
",
    errors: [{
      message: "Ternary expression's alternate must be indented on a new line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  :\n\
    {\n\
    d: 'd',\n\
  }\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
  {\n\
    d: 'd',\n\
  }\n\
  :\n\
    e\n\
",
    errors: [{
      message: "Ternary expression's consequent must be indented on a new line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    {\n\
    d: 'd',\n\
  }\n\
  :\n\
    e\n\
",
  }, {
    code: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ? d : e\n\
",
    errors: [{
      message: "Chained ternary expressions must be multi-line",
    }],
    output: "\n\
const foo =\n\
  a ?\n\
    b\n\
  : c ?\n\
    d\n\
  :\n\
    e\n\
",
  }],
})
