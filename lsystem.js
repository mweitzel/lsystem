tl = require('teelog')
module.exports = {
  iterate: function(previous, rules) {
    return previous
      .split('')
      .map(function(character) {
        return rules[character]
        ? ("_"+character)
        : character
      }).reduce(function(carry, c) {
        return carry + (c[0] === '_' ? rules[c[1]] : c)
      }, '')
  }
, generateSystem: function(unRand_){
    return {
      start: this.generateString(unRand_)
    , rules: this.generateRules(unRand_)
    , angle: sample([ 15, 30, 45, 60, 90, randomInt(90, unRand_) ], unRand_)
    }
    return 
  }
, generateRules: function(unRand_) {
    return (function appendNRandomRules(rules, n) {
      return n <= 0
      ? rules
      : appendNRandomRules.call(this, this.appendRule(rules, unRand_) , n-1)
    }).call(this, {}, 1 + randomInt(5, unRand_))
  }
, appendRule: function(rules, unRand_) {
    return Object.defineProperty(rules, this.randomChar(unRand_), {
      value: this.generateString(unRand_),
      writable: true,
      enumerable: true,
      configurable: true
    })
  }
, generateString: function(unRand_){
    return (function appendNRandomStrings(string, n) {
      return n <= 0
      ? string
      : appendNRandomStrings.call(this, string + this.randomChar(unRand_), n-1)
    }).call(this, '', 1 + randomInt(10, unRand_))
  }
, randomChar: function(unRand_) {
    return sample( Object.keys(this.rules).concat(this.holders), unRand_)
  }
, randomRule: function(unRand_) {
    return sample(Object.keys(this.rules), unRand_)
  }
, randomHolder: function(unRand_) {
    return sample(this.holders, unRand_)
  }
, holders: 'ABCDE'.split('')
, rules: {
    'F': 'drawForward'
  , 'G': 'moveForward'
  , '^': 'negateAngle'
  , '+': 'turn'
  , '-': 'unturn'
  , '[': 'fork'
  , ']': 'quit'
  }
, sample: sample
, random: random
, randomInt: randomInt
}

function sample(arr, unRand_) {
  return arr[ Math.floor(arr.length * (random(unRand_))) ]
}

function random(floatOrArrayOf) {
  if( typeof floatOrArrayOf === 'number') return floatOrArrayOf
  if( typeof floatOrArrayOf  === 'object' && floatOrArrayOf.constructor === Array ) {
    return floatOrArrayOf.pop()
  }
  return Math.random()
}

function randomInt(scaler, unRand_) {
  return parseInt(random(unRand_)*scaler)
}
