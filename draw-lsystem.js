var lsystem = require('./lsystem')
  , vector = require('./vector')
  , beget = require('./beget')

var tl = require('teelog')
module.exports = {
  drawWithCtx: function(ctx, systemString, world) {
    (function enforceNextRule(systemString, world) {
      if(systemString.length === 0) return
      enforceNextRule.apply(
        this
      , (this[methodNameFromRulesChar(systemString[0])])
          .call(
            this
          , ctx
          , systemString
          , world || { x: 0 , y: 0 , angle: 0, turningAngle: 30 }
          )
      )
    }).call(this, systemString, world)
  }
, drawForward: function(ctx, systemString, world) {
    return (function(nextWorld) {
      ctx.beginPath()
      ctx.strokeStyle = 'white';
      ctx.moveTo(world.x, world.y)
      ctx.lineTo(nextWorld.x, nextWorld.y)
      ctx.stroke()
      return [systemString.slice(1), nextWorld]
    }).call(this, worldForward(world))
  }
, moveForward: function(ctx, systemString, world) {
    return (function(nextWorld) {
      ctx.moveTo(nextWorld.x , nextWorld.y)
  //  ctx.beginPath()
  //  ctx.strokeStyle = '#002';
  //  ctx.moveTo(world.x, world.y)
  //  ctx.lineTo(nextWorld.x, nextWorld.y)
  //  ctx.stroke()
      return [systemString.slice(1), nextWorld]
    }).call(this, worldForward(world))
  }
, negateAngle: function(ctx, systemString, world) {
    return [
      systemString.slice(1)
    , overwrite(world, 'angle', 180-world.angle)
    ]
  }
, turn: function(ctx, systemString, world) {
    return [
      systemString.slice(1)
    , overwrite(world, 'angle', world.angle + world.turningAngle)
    ]
  }
, unturn: function(ctx, systemString, world) {
    return [
      systemString.slice(1)
    , overwrite(world, 'angle', world.angle - world.turningAngle)
    ]
  }
, fork: function(ctx, systemString, world) {
//console.log('wtfffffff')
//console.log(this)
//console.log(this.drawWithCtx)
//console.log(typeof this.drawWithCtx)
    this.drawWithCtx(ctx, systemString.slice(1), beget(world))
    function stringAfterMatchingClosingBracket(string, omit) {
      if(string.length === 0) { return '' }
      else if(string[0] === '[') {
        return stringAfterMatchingClosingBracket(string.slice(1), omit+1)
      }
      else if(string[0] === ']') {
        if(omit === 0) { return string.slice(1) }
        return stringAfterMatchingClosingBracket(string.slice(1), omit-1)
      }
      else
        return stringAfterMatchingClosingBracket(string.slice(1), omit)
    }
    return [ stringAfterMatchingClosingBracket(systemString.slice(1), 0), beget(world) ]
  }
, quit: function(ctx, systemString, world) {
    return [ '', beget(world) ]
  }
, placeHolder: function(ctx, systemString, world) {
    return [ systemString.slice(1), beget(world) ]
  }
}

function worldForward(world) {
  return [
    ['x', world.x + vector.fromDegree(world.angle)[0] * 10]
  , ['y', world.y + vector.fromDegree(world.angle)[1] * 10]
  ].reduce(applyFlatArgs(overwrite), world)
}

function applyFlatArgs(cb) {
  return function() {
    return cb.apply(cb, flatten(arguments))
  }
}

function flatten(arr) {
  return Array.prototype.reduce.call(arr, function(a, b) { return a.concat(b) }, [])
}

function methodNameFromRulesChar(character) {
  return lsystem.rules[character] || 'placeHolder'
}

function overwrite(obj, attr, value) {
  if(!attr) { return beget(obj) }
  return Object.defineProperty(beget(obj), attr, {
    value: value
  , writable: true
  , enumerable: true
  , configurable: true
  })
}
