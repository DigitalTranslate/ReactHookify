/* eslint-disable no-lonely-if */
/* eslint-disable guard-for-in */
/* eslint-disable complexity */
/* eslint-disable max-statements */
const {
  getInsideOfFunc,
  getInsideOfLifeCycle,
  getEndIdxOfBraces,
  getEndIdxOfFunc,
} = require('../commonUtils')
/*
INPUT:
let obj = {
  componentDidMount: useEffect(() => {
    statement1
    statement2
    cleanup1
  }),
  componentDidUpdate: useEffect(() => {
    statement1
    statement2
    etc
  }),
  componentWillUnmount: useEffect(() => {
    cleanup2
  }),
}
OUTPUT
[
  useEffect(() => {
    statement1
    cleanup1
  }),
  useEffect(() => {
    statement2
  }),
]
*/
const iterator = (obj) => {
  let effectsArr = []
  for (let key in obj) {
    if (key === 'componentDidMount()') {
      let inside = getInsideOfFunc(obj[key], 'useEffect').trim()
      let secondArgIdx = getEndIdxOfFunc(obj[key], 'useEffect') + 1
      let argumentSlice = obj[key].slice(secondArgIdx)
      let secondArg = argumentSlice.match(/(\[)(.*?)(])/)[0]
      let currentEffectsArr = parser(inside, secondArg)
      effectsArr = [...effectsArr, ...currentEffectsArr]
    } else if (key === 'componentDidUpdate()') {
      effectsArr = [...effectsArr, ...obj[key]]
    } else {
      effectsArr.push(obj[key])
    }
  }
  return effectsArr
}
const parser = (useEffectString, secondArg) => {
  let variablesObj = findUniqueVars(useEffectString)
  let statementsArr = findStatements(useEffectString)
  combineVars(variablesObj, statementsArr)
  let groupedStatementsArr = groupStatements(variablesObj, statementsArr)
  let useEffectsArr = createUseEffects(groupedStatementsArr, secondArg)
  return useEffectsArr
}
function createUseEffects(groupedStatementsArr, secondArg) {
  let effectsArr = []
  for (let i = 0; i < groupedStatementsArr.length; i++) {
    let singleUseEffect = `useEffect(() => {
      ${groupedStatementsArr[i]}
    }, ${secondArg})`
    effectsArr.push(singleUseEffect)
  }
  return effectsArr
}
function groupStatements(variablesObj, statementsArr) {
  let statementsArrFound = []
  let groupedStatementsArr = []
  for (let key in variablesObj) {
    let currentGroup = []
    // going through one variables array of children:
    for (let variable of variablesObj[key].variables) {
      let regex = new RegExp(`([^a-z0-9])(${variable})([^a-z0-9])`)
      for (let i = 0; i < statementsArr.length; i++) {
        let statement = statementsArr[i]
        if (statement.search(regex) > -1) {
          if (!currentGroup.includes(statement)) {
            currentGroup.push(statement)
          }
          if (!statementsArrFound.includes(statement)) {
            statementsArrFound.push(statement)
          }
        }
      }
    }
    if (currentGroup.length) {
      groupedStatementsArr.push(currentGroup)
    }
    currentGroup = []
  }
  let remainingStatements = statementsArr.filter((statement) => {
    return !statementsArrFound.includes(statement)
  })
  for (let i = 0; i < remainingStatements.length; i++) {
    groupedStatementsArr.push([remainingStatements[i]])
  }
  return groupedStatementsArr
}
function combineVars(variablesObj, statementArr) {
  // go through each statement
  for (let statement of statementArr) {
    let foundVar = false
    let firstVar
    // find the first unique variable in the statement
    // if theres more than one unique variable, update the variables Obj to show that link
    for (let variable in variablesObj) {
      let regex = new RegExp(`([^a-z0-9])(${variable})([^a-z0-9])`)
      if (foundVar === false) {
        if (statement.search(regex) > -1) {
          firstVar = variable
          foundVar = true
        }
      } else {
        // if theres a second variable in the statement
        if (statement.search(regex) > -1) {
          // check if first var has a parent. If first var has a parent, then add any additional variables to that parent. If first var has no parent, then define parent relationship between first and second vars now
          if (variablesObj[firstVar].parent) {
            let papa = variablesObj[firstVar].parent
            variablesObj[papa].variables.push(variable)
            variablesObj[variable].parent = papa
          } else {
            variablesObj[firstVar].variables.push(variable)
            variablesObj[variable].parent = firstVar
          }
        }
      }
    }
  }
  // delete any children from object (only keep parents and have their children be in their respective values)
  for (let key in variablesObj) {
    if (variablesObj[key].parent) {
      delete variablesObj[key]
    }
  }
}
function findUniqueVars(useEffectString) {
  let variablesObj = {}
  let newString = useEffectString
  while (newString.search(/([a-z0-9_.[]+)(]?)([^a-z]*)(=)/i) > -1) {
    let matchedArr = newString.match(/([a-z0-9_.[]+)(]?)([^a-z]*)(=)/i)
    let newVar = matchedArr[1] + matchedArr[2]
    // if right side of equal sign matches to an existing variable, then add it to the respective array in the obj
    // else make a new key for that var
    variablesObj[newVar] = { variables: [newVar], statements: [] }
    newString = newString.substring(matchedArr.index + matchedArr[0].length)
  }
  return variablesObj
}
function findStatements(string) {
  // while loop to cut/paste each line/statement into their appropriate effect
  let newString = string.trim()
  const statementsArr = []
  // get statement (based of either \n or valid braces)
  while (newString.length) {
    let newStatement
    if (newString.indexOf('\n') === -1) {
      newStatement = newString
      statementsArr.push(newStatement)
      newString = ''
    } else {
      // if valid braces is true (or no braces) then we look for newline. If valid braces is false, then we need the index of the close brace
      let newLineIdx = newString.indexOf('\n')
      newStatement = newString.slice(0, newString.indexOf('\n'))
      if (newStatement.search(/[{[(]/) > -1) {
        let endIdx = getEndIdxOfBraces(newString)
        if (endIdx > newLineIdx) {
          if (!newString.indexOf('\n', endIdx) === -1) {
            endIdx = newString.indexOf('\n', endIdx)
          }
          newStatement = newString.slice(0, endIdx)
        }
      }
      newString = newString.substring(newStatement.length + 2) // might need to be +1?
      statementsArr.push(newStatement)
    }
  }
  return statementsArr
}
module.exports = {
  iterator,
}
