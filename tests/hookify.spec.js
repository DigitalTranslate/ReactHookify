const { expect } = require('chai')
const hookify = require('./hookify')
const specs = require('./testComponents')

describe('hookify', () => {
  it('handles class with just render', () => {
    expect(hookify(specs.test1)).to.equal(specs.answer1)
  })
  it('handles basic this.state', () => {
    expect(hookify(specs.test2)).to.equal(specs.answer2)
  })
  it('handles basic generic method', () => {
    expect(hookify(specs.test3)).to.equal(specs.answer3)
  })
  it('handles imports', () => {
    expect(hookify(specs.test4)).to.equal(specs.answer4)
  })
  it('handles complex this.state', () => {
    expect(hookify(specs.test5)).to.equal(specs.answer5)
  })
  it('handles arrow methods', () => {
    expect(hookify(specs.test6)).to.equal(specs.answer6)
  })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
  // it('handles basic generic method', () => {
  //   expect(hookify(specs.test3)).to.equal(specs.answer3)
  // })
})
