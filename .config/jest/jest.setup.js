'use strict'

const Enzyme = require('enzyme')
// TODO: migrate to @testing-library
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')

Enzyme.configure({ adapter: new Adapter() })

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

global.__DEV__ = true
