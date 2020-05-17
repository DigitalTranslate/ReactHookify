const translateToFunctionComp = require('../lib/mainTranslator')
const prettier = require('prettier')

function hookify(testStr) {
  const formattedTest = prettier.format(testStr, {
    semi: false,
    parser: 'babel',
  })
  const translatedFile = translateToFunctionComp(formattedTest)
  const formattedFinal = prettier.format(translatedFile, {
    semi: false,
    parser: 'babel',
  })
  return formattedFinal
}

module.exports = hookify
