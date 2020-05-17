const { getEndIdxOfFunc } = require('./commonUtils')

function readClassCompDetails(fileInString) {
  // returns the index for the start of the class component
  function getClassCompIdx(string) {
    return string.search(/(class)([ \t]+)([\S]+)([ \t]+)(extends)/i)
  }
  // returns a slice of the whole class Component (removing everything above and below it)
  function getClassComp(string, startIdx) {
    let stringSlice = string.slice(startIdx)
    let endIdxOfClassComp = getEndIdxOfFunc(stringSlice, 'Component')
    return stringSlice.slice(0, endIdxOfClassComp)
  }
  // Returns the name of the class
  function getClassName(string, startIdx) {
    const classSlice = string.slice(startIdx)
    const nameOfClass = classSlice.split(/[ ]+/)[1]
    return nameOfClass
  }

  let classDetails = {}

  classDetails.classCompIdx = getClassCompIdx(fileInString)
  classDetails.beforeClass = fileInString.slice(0, classDetails.classCompIdx)
  classDetails.nameOfClass = getClassName(
    fileInString,
    classDetails.classCompIdx
  )
  classDetails.classCompInString = getClassComp(
    fileInString,
    classDetails.classCompIdx
  )
  classDetails.afterClass = fileInString.slice(
    classDetails.classCompIdx + classDetails.classCompInString.length
  )
  //checks whole class component for props
  classDetails.propsCheck = classDetails.classCompInString.includes('props')
    ? 'props'
    : ''
  classDetails.startOfBodyIdx = classDetails.classCompInString.indexOf('{') + 1
  return classDetails
}

module.exports = { readClassCompDetails }
