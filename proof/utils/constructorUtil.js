const { getInsideOfFunc } = require('./commonUtils')

//THIS FUNCTION TRANSLATES CONTENTS OF CONSTRUCTOR
function handleConstructor(fullClassStr) {
  const constructorInside = getInsideOfFunc(fullClassStr, 'constructor')
  const stateInsides = getInsideOfFunc(constructorInside, 'this.state')
  if (!stateInsides) return
  const arrOfStates = stateInsides
    .split(',')
    .map((singleState) => singleState.trim().split(':'))
  //arrOfStates = [ [ 'counter', ' 0' ], [ 'open', ' false' ], [ 'closed', ' true' ] ]
  return arrOfStates
    .map(
      (singleState) =>
        `const [${singleState[0]}, set${
          singleState[0]
        }] = useState(${singleState[1].trim()})`
    )
    .join('\n')
}

module.exports = {
  handleConstructor,
}
