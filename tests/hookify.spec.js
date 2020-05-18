const { expect } = require('chai')
const hookify = require('./hookify')
const specs = require('./testComponents')

describe('hookify', () => {
  it('can fail', () => {
    expect(hookify(specs.test1)).to.equal(specs.answer1)
  })
})
