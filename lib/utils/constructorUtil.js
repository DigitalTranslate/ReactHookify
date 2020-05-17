const {
  getInsideOfFunc,
  capitalize,
  parseObjIntoArr,
  getEndIdxOfFunc,
} = require('./commonUtils')

//THIS FUNCTION TRANSLATES CONTENTS OF CONSTRUCTOR
function handleConstructor(classDetails) {
  const fullClassStr = classDetails.classCompInString
  if (!/(constructor)[ ]*\(/.test(fullClassStr)) {
    return ''
  }
  classDetails.startOfBodyIdx = getEndIdxOfFunc(fullClassStr, 'constructor')
  let constructorInside = getInsideOfFunc(fullClassStr, 'constructor')
  let stateInsides
  let arrOfStates

  if (constructorInside.includes('this.state')) {
    stateInsides = getInsideOfFunc(constructorInside, 'this.state')
    arrOfStates = parseObjIntoArr(stateInsides)
  } else {
    return ''
  }

  //useState template
  const handledConstructor = arrOfStates
    .map(
      (singleState) =>
        `const [${singleState[0]}, set${capitalize(
          singleState[0]
        )}] = useState(${singleState[1].trim()})`
    )
    .join('\n')

  return handledConstructor
}

module.exports = {
  handleConstructor,
}
