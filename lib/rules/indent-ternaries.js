/**
 * @fileoverview Have ternaries follow typical if/else indent style
 * @author ngasull
 */
"use strict"

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Have ternaries follow typical if/else indent style",
      category: "Conditionals",
      recommended: false
    },
    fixable: "whitespace",
    schema: [{
      type: "object",
      properties: {
        indent: {
          type: "number",
        },
        testParens: {
          enum: ["never", "ignore"],
        },
      },
      additionalProperties: false
    }]
  },

  create(context) {

    const sourceCode = context.getSourceCode()
    const options = context.options[0] || {}
    const optTestParens = options.testParens || "never"
    const indent = options.indent || 2

    function getFirstTokenOrParens(node) {
      return (
        isInParens(node) ?
          sourceCode.getTokenBefore(node)
        :
          sourceCode.getFirstToken(node)
      )
    }

    function getLastTokenOrParens(node) {
      return (
        isInParens(node) ?
          sourceCode.getTokenAfter(node)
        :
          sourceCode.getLastToken(node)
      )
    }

    function getStartOfLine(token) {
      const line = token.loc.start.line
      let t = token
      let tokenBefore = token
      while (tokenBefore && tokenBefore.loc.start.line === line) {
        t = tokenBefore
        tokenBefore = sourceCode.getTokenBefore(t)
      }
      return t
    }

    function isInParens(node) {
      const before = sourceCode.getTokenBefore(node)
      const after = sourceCode.getTokenAfter(node)
      return before && after && before.value === "(" && after.value === ")"
    }

    function isTokenOnSameLine(left, right) {
      return left.loc.end.line === right.loc.start.line
    }

    function makeSpaceOf(n) {
      return Array.apply(0, Array(n)).reduce(acc => acc.concat(" "), "")
    }

    function nodeToText(node) {
      return sourceCode.getTokens(node).map(n => n.value).join(" ")
    }

    function replaceBetween(fixer, node1, node2, replacement) {
      return fixer.replaceTextRange([node1.range[1], node2.range[0]], replacement)
    }

    function replaceBetweenIncl(fixer, node1, node2, replacement) {
      return fixer.replaceTextRange([node1.range[0], node2.range[1]], replacement)
    }

    function rewriteTernary(fixer, node, baseIndent, preText, postText) {
      return (
        replaceBetweenIncl(
          fixer,
          sourceCode.getFirstToken(node),
          sourceCode.getLastToken(node),
          (preText || "")
          + nodeToText(node.test)
          + " ?\n"
          + makeSpaceOf(baseIndent + indent)
          + nodeToText(node.consequent)
          + "\n"
          + makeSpaceOf(baseIndent)
          + ":\n"
          + makeSpaceOf(baseIndent + indent)
          + nodeToText(node.alternate)
          + (postText || "")
        )
      )
    }

    return {
      ConditionalExpression(node) {
        const questionMarkToken = sourceCode
          .getTokensBetween(node.test, node.consequent)
          .find(t => t.type === "Punctuator" && t.value === "?")
        const colonToken = sourceCode
          .getTokensBetween(node.consequent, node.alternate)
          .find(t => t.type === 'Punctuator' && t.value === ':')

        if (!questionMarkToken || !colonToken) {
          context.report({
            node: node,
            message: "Didn't parse the ternary right, please file an issue"
          })
          return
        }

        const isTestInParens = isInParens(node.test)
        const isConsequentInParens = isInParens(node.consequent)
        const isAlternateInParens = isInParens(node.alternate)

        const firstToken = sourceCode.getFirstToken(node)
        const lastTestToken = sourceCode.getTokenBefore(questionMarkToken)
        const firstConsequentToken = sourceCode.getTokenAfter(questionMarkToken)
        const lastConsequentToken = sourceCode.getTokenBefore(colonToken)
        const firstAlternateToken = sourceCode.getTokenAfter(colonToken)
        const lastToken = sourceCode.getLastToken(node)

        const tokenBefore = sourceCode.getTokenBefore(node)
        const isChainedTernary =
          tokenBefore &&
          tokenBefore.type === "Punctuator" &&
          tokenBefore.value === ":" &&
          sourceCode.getNodeByRangeIndex(tokenBefore.start).type === 'ConditionalExpression'
        const indentReferenceColumn =
          isChainedTernary ?
            tokenBefore.loc.start.column
          : tokenBefore && tokenBefore.loc.end.line === firstToken.loc.start.line ?
            // This case fixes indentation when incorrect at ternary's start
            getStartOfLine(tokenBefore).loc.start.column + indent
          :
            firstToken.loc.start.column

        if (optTestParens === "never" && isInParens(node.test)) {
            context.report({
              node: node.test,
              message: "There shouldn't be parens around test",
              fix(fixer) {
                return replaceBetweenIncl(
                  fixer,
                  sourceCode.getTokenBefore(node.test),
                  sourceCode.getTokenAfter(node.test),
                  nodeToText(node.test)
                )
              },
            })
        }

        if (firstToken.loc.start.line === lastToken.loc.end.line) {
          if (isChainedTernary) {
            context.report({
              node: node.alternate,
              message: "Chained ternary expressions must be multi-line",
              fix(fixer) {
                return rewriteTernary(fixer, node, indentReferenceColumn)
              },
            })
          } else {
            // Nothing to say: simple inline ternaries are fine
          }

        } else {

          if (!isChainedTernary && tokenBefore) {
            if (tokenBefore.loc.end.line === firstToken.loc.start.line) {
              context.report({
                node: node,
                message: "Multiline ternaries must start on a new line",
                fix(fixer) {
                  return rewriteTernary(fixer, node, indentReferenceColumn, "\n" + makeSpaceOf(indentReferenceColumn))
                },
              })
            } else if (firstToken.loc.start.column <= getStartOfLine(tokenBefore).loc.start.column) {
              context.report({
                node: node,
                message: "Multiline ternaries must be indented",
                fix(fixer) {
                  return rewriteTernary(fixer, node, indentReferenceColumn + indent, makeSpaceOf(firstToken.loc.start.column - getStartOfLine(tokenBefore).loc.start.column + indent))
                },
              })
            }
          }

          if (!isTokenOnSameLine(lastTestToken, questionMarkToken)) {
            context.report({
              node: node.test,
              message: "Test part of a ternary expression must be followed by question mark token (?) on the same line",
              fix(fixer) {
                return replaceBetween(fixer, lastTestToken, questionMarkToken, " ")
              },
            })
          }

          if (
            isTokenOnSameLine(questionMarkToken, firstConsequentToken) ||
            firstConsequentToken.loc.start.column <= indentReferenceColumn
          ) {
            context.report({
              node: node.consequent,
              message: "Ternary expression's consequent must be indented on a new line",
              fix(fixer) {
                return replaceBetween(fixer, questionMarkToken, firstConsequentToken,
                  "\n" + makeSpaceOf(indentReferenceColumn + indent)
                )
              },
            })
          }

          if (isTokenOnSameLine(lastConsequentToken, colonToken)) {
            context.report({
              node: node.consequent,
              message: "Ternary expression's consequent mustn't on the same line as colon token (:)",
              fix(fixer) {
                return replaceBetween(fixer, lastConsequentToken, firstAlternateToken,
                  "\n" + makeSpaceOf(indentReferenceColumn) + ":\n" + makeSpaceOf(indentReferenceColumn + indent)
                )
              },
            })
          } else if (colonToken.loc.start.column !== indentReferenceColumn) {
            context.report({
              node: node,
              message: "Ternary expression's colon token must be aligned with the start of the ternary",
              fix(fixer) {
                return replaceBetween(fixer, lastConsequentToken, firstAlternateToken,
                  "\n" + makeSpaceOf(indentReferenceColumn) + ":\n" + makeSpaceOf(indentReferenceColumn + indent)
                )
              },
            })
          }

          if (
            isTokenOnSameLine(colonToken, firstAlternateToken) &&
            node.alternate.type !== "ConditionalExpression"
          ) {
            context.report({
              node: node.alternate,
              message: "Ternary expression's alternate mustn't be on the same line as colon token (:)",
              fix(fixer) {
                return replaceBetween(fixer, colonToken, firstAlternateToken,
                  "\n" + makeSpaceOf(indentReferenceColumn + indent)
                )
              },
            })
          }

          if (
            !isTokenOnSameLine(colonToken, firstAlternateToken) &&
            firstAlternateToken.loc.start.column <= indentReferenceColumn
          ) {
            context.report({
              node: node.consequent,
              message: "Ternary expression's alternate must be indented on a new line",
              fix(fixer) {
                return replaceBetween(fixer, colonToken, firstAlternateToken,
                  "\n" + makeSpaceOf(indentReferenceColumn + indent)
                )
              },
            })
          }
        }
      }
    }
  }
}
