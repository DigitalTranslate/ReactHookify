const translateToFunctionComp = require('./mainTranslator')
const { oldifyPath } = require('./utils/commonUtils')
const fs = require('fs')
const prettier = require('prettier')
const { yellow, cyan, red } = require('chalk')

/* ONLY RUNS WHEN THERE'S A -r FLAG */
//THIS FUNCTION REPLACES FILE WITH FUNC COMPONENT EQUIVALENT AND COPIES OLD
//VERSION AT _oldCopy.js
async function readAndReplace(filepath) {
  try {
    const untouchedContent = await fs.promises.readFile(filepath, 'utf-8')

    //DO NOTE USE readFileSync
    let content = prettier.format(untouchedContent, {
      semi: false,
      parser: 'babel',
    })
    // remove all comments
    content = content
      .replace(/([^:])(\/\/)(.*?)(\n)/g, '')
      .replace(/(\/\*)(.|\n)*?(\*\/)/g, '')
    const lifecycleCheck = /(componentDidMount\()|(componentDidUpdate\()|(componentWillUnmount\()/.test(
      content
    )
    const validClassCompTest =
      /(class)(.|\n)*?(extends)(.|\n)*?(Component)/.test(content) &&
      /([^a-zA-z0-9_])(render\()/.test(content)
    const funcComponent = translateToFunctionComp(content)
    // const oldPath = oldifyPath(filepath)
    // fs.writeFile(oldPath, unformattedContent, (err) => {
    //   if (err) throw err
    //   console.log(cyan(`Copied old file exactly as it was at ${oldPath}`))
    // })
    createFunctionComponentFile(
      funcComponent,
      filepath,
      lifecycleCheck,
      validClassCompTest,
      untouchedContent
    )
  } catch (error) {
    console.error(error)
  }
}

//THIS FUNCTION TAKES CREATED STRING AND WRITES A FILE
function createFunctionComponentFile(
  funcCompInStr,
  filepath,
  lifecycleCheck,
  validClassCompTest,
  untouchedContent
) {
  if (validClassCompTest) {
    fs.writeFile(
      filepath,
      prettier.format(funcCompInStr, { semi: false, parser: 'babel' }),
      (err) => {
        if (err) throw err
        if (lifecycleCheck) {
          console.log(
            yellow(
              'WARNING: You are attempting to use React-Hookify on a lifecycle method. There are instances where react hooks do not directly translate to lifecycle methods. Please refer to the limitations section of our documentation for more information: https://react-hookify.herokuapp.com/'
            )
          )
        }

        const oldPath = oldifyPath(filepath)
        fs.writeFile(oldPath, untouchedContent, (error) => {
          if (error) throw error
          console.log(cyan(`Copied old file exactly as it was at ${oldPath}`))
        })
        console.log(cyan(`Replaced File at ${filepath}`))
      }
    )
  } else {
    console.log(red('Please enter a valid React class component!'))
  }
}

module.exports = { readAndReplace }
