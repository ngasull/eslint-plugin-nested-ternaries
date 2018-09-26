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
    schema: []
  },

  create(context) {

    const sourceCode = context.getSourceCode()
    const indent = 2

    function isTokenOnSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line
    }

    function makeSpaceOf(n) {
      return Array.apply(0, Array(n)).reduce(acc => acc.concat(" "), "")
    }

    function replaceBetween(fixer, node1, node2, replacement) {
      return fixer.replaceTextRange([node1.range[1], node2.range[0]], replacement)
    }

    return {
      ConditionalExpression(node) {
        const firstToken = sourceCode.getFirstToken(node)
        const lastToken = sourceCode.getLastToken(node)

        const questionMarkToken = sourceCode.getTokenBefore(node.consequent)
        const colonToken = sourceCode.getTokenAfter(node.consequent)

        const lastTestToken = sourceCode.getLastToken(node.test)
        const firstConsequentToken = sourceCode.getTokenAfter(questionMarkToken)
        const lastConsequentToken = sourceCode.getTokenBefore(colonToken)
        const firstAlternateToken = sourceCode.getTokenAfter(colonToken)

        const tokenBefore = sourceCode.getTokenBefore(node)
        const isChainedTernary = tokenBefore.type === "Punctuator" && tokenBefore.value === ":"
        const indentReferenceColumn =
          isChainedTernary ?
            tokenBefore.loc.start.column
          :
            firstToken.loc.start.column

        if (
          questionMarkToken.type !== "Punctuator" ||
          questionMarkToken.value !== "?" ||
          colonToken.type !== "Punctuator" ||
          colonToken.value !== ":"
        ) {
          context.report({
            node: node,
            message: "Didn't parse the ternary right, please file an issue"
          })

        } else if (firstToken.loc.start.line === lastToken.loc.end.line) {
          if (isChainedTernary) {
            context.report({
              node: node.alternate,
              message: "Chained ternary expressions must be multi-line",
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  nodeToText(node.test)
                  + " ?\n"
                  + makeSpaceOf(indentReferenceColumn + indent)
                  + nodeToText(node.consequent)
                  + "\n"
                  + makeSpaceOf(indentReferenceColumn)
                  + ":\n"
                  + makeSpaceOf(indentReferenceColumn + indent)
                  + nodeToText(node.alternate)
                )
              },
            })
          } else {
            // Nothing to say: simple inline ternaries are fine
          }

        } else {
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
        }

        function nodeToText(node) {
          return sourceCode.getTokens(node).map(n => n.value).join(" ")
        }
      }
    }
  }
}
