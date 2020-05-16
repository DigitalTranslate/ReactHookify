const translateToFunctionComp = require('./mainTranslator')
const { hookifyPath } = require('./utils/commonUtils')
const fs = require('fs')
const prettier = require('prettier')
const { yellow } = require('chalk')

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
async function readAndCreate(filepath) {
  try {
    const unformattedContent = await fs.promises.readFile(filepath, 'utf-8')

    //DO NOTE USE readFileSync
    const content = prettier.format(unformattedContent, {
      semi: false,
      parser: 'babel',
    })
    const funcComponent = translateToFunctionComp(content)
    createFunctionComponentFile(funcComponent, filepath)
  } catch (error) {
    console.error(error)
  }
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(funcCompInStr, filepath) {
  const newPath = hookifyPath(filepath)
  fs.writeFile(
    newPath,
    prettier.format(funcCompInStr, { semi: false, parser: 'babel' }),
    (err) => {
      if (err) throw err
      console.log(yellow('Created Hookified File'))
    }
  )
}

module.exports = readAndCreate
