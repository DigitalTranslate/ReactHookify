const str = '{test{testtesttesttest,testtest}notgettinghere}'
const regexp = /({)([^}]*)(})/g
console.log([...str.matchAll(regexp)])
