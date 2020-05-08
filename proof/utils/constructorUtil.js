const { getInsideOfFunc, capitalize } = require('./commonUtils')

//THIS FUNCTION TRANSLATES CONTENTS OF CONSTRUCTOR
function handleConstructor(fullClassStr) {
  let constructorInside = getInsideOfFunc(fullClassStr, 'constructor')
  let stateInsides
  if (constructorInside.includes('this.state')) {
    stateInsides = getInsideOfFunc(constructorInside, 'this.state')
  } else {
    return ''
  }
  const arrOfStates = stateInsides
    //might need to get tricky to handle commas in objects inside of state
    .split(/,(?=\s+\S+:)/)
    .map((singleState) => singleState.trim().split(':'))
    .filter((singleState) => singleState.length > 1) //filter is to handle hanging commas after the last state entry
  console.log(arrOfStates)
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
