const { getInsideOfFunc, capitalize, validBraces } = require('./commonUtils')

//THIS FUNCTION TRANSLATES CONTENTS OF CONSTRUCTOR
function handleConstructor(fullClassStr) {
  //get insides of constructor
  let constructorInside = getInsideOfFunc(fullClassStr, 'constructor')
  let stateInsides
  let storage = []

  if (constructorInside.includes('this.state')) {
    //get insides of the state
    stateInsides = getInsideOfFunc(constructorInside, 'this.state')

    //the logic to handle non-empty objects in state is tough!
    if (stateInsides.includes('{')) {
      //extracts and stores all the objects to plug back in later
      stateInsides = storeAndReplaceObjects(stateInsides, 0, storage)
    }
  } else {
    return ''
  }

  //splits our state into an array
  const arrOfStates = stateInsides
    .split(/,(?=\s+\S+:)/)
    .map((singleState) => singleState.trim().split(':'))

  //if the state had some objects, this gives them back
  arrOfStates.map((singleState) => {
    if (singleState[1].includes('|?$|props')) {
      singleState[1] = storage.shift()
    }
    return singleState
  })

  //with the array of states, this makes the useState equivalents
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

function storeAndReplaceObjects(stateInsides, idx, storage) {
  if (!stateInsides.includes('{')) {
    return stateInsides
  } else {
    const startIdx = stateInsides.indexOf('{')
    let endIdx = startIdx + 1
    let funcSlice = stateInsides.slice(startIdx, endIdx)
    while (!validBraces(funcSlice)) {
      endIdx++
      funcSlice = stateInsides.slice(startIdx, endIdx)
    }
    let objToStore = funcSlice.slice(0, funcSlice.length)
    storage.push(objToStore)
    //push to storage here
    let newState = stateInsides.replace(objToStore, `${idx}|?$|props`)
    idx++
    return storeAndReplaceObjects(newState, idx, storage)
  }
}

module.exports = {
  handleConstructor,
}
