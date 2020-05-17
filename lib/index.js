const translateToFunctionComp = require('./mainTranslator')
const { hookifyPath } = require('./utils/commonUtils')
const fs = require('fs')
const prettier = require('prettier')
const { yellow, cyan } = require('chalk')

//THIS FUNCTION TAKES FILEPATH, READS FILE AT PATH AND THEN CREATES
//FUNCTIONAL COMPONENT EQUIVALENT
async function readAndCreate(filepath) {
  try {
    const unformattedContent = await fs.promises.readFile(filepath, 'utf-8')

    //DO NOTE USE readFileSync
    let content = prettier.format(unformattedContent, {
      semi: false,
      parser: 'babel',
    })
    // remove all comments
    content = content
      .replace(/(\/\/)(.*?)(\n)/g, '')
      .replace(/(\/\*)(.|\n)*?(\*\/)/g, '')
    const lifecycleCheck = /(componentDidMount\()|(componentDidUpdate\()|(componentWillUnmount\()/.test(
      content
    )
    const funcComponent = translateToFunctionComp(content)
    createFunctionComponentFile(funcComponent, filepath, lifecycleCheck)
  } catch (error) {
    console.error(error)
  }
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(funcCompInStr, filepath, lifecycleCheck) {
  const newPath = hookifyPath(filepath)

  fs.writeFile(
    newPath,
    prettier.format(funcCompInStr, { semi: false, parser: 'babel' }),
    (err) => {
      if (err) throw err
      if (lifecycleCheck) {
        console.log(
          yellow(
            'WARNING: You are attempting to use React-Hookify on a lifecycle method. There are instances where react hooks do not directly translate to lifecycle methods. Please refer to our documentation for more information: https://www.docs.com'
          )
        )
      }
      console.log(cyan('Created Hookified File'))
    }
  )
}

module.exports = readAndCreate
