'use strict'

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

global.__DEV__ = true
