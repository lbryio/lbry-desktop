var util = require('util')
var Transform = require('stream').Transform

util.inherits(Counter, Transform)

module.exports = Counter

function Counter(options) {
  if (!(this instanceof Counter))
    return new Counter(options)

  Transform.call(this, options)
  this.length = 0
}

Counter.prototype._transform = function (chunk, encoding, callback) {
  this.length += chunk.length
  this.push(chunk)
  callback()
}