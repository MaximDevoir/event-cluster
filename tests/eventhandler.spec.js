/* eslint max-nested-callbacks: [1, 5] */
import chai from 'chai'
import EventHandler from '../src/EventHandler'

chai.should()

/* istanbul ignore next */
const trueop = () => true
/* istanbul ignore next */
const falseop = () => false

const { expect } = chai

const psuedoGlobal = {}

describe('EventHandler', () => {
  let eventHandler
  beforeEach(() => {
    eventHandler = new EventHandler()
  })

  it('this.events setup correctly', () => {
    eventHandler.events.should.eql({})
  })

  describe('getListeners', () => {
    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({})
    })

    it('creates and returns empty array of listeners when event doesn\'t exist', () => {
      const foo = eventHandler.getListeners('foo')
      eventHandler.events.should.eql({
        foo: []
      })
      foo.length.should.eql(0)
    })

    it('returns array of listeners when event exists', () => {
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      const foo = eventHandler.getListeners('foo')
      foo.should.eql([trueop, trueop])
    })
  })

  describe('addListener', () => {
    beforeEach(() => {
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('bar', trueop)
    })

    /**
     * Ensure addListener is setup correctly.
     */
    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({
        foo: [trueop, trueop],
        bar: [trueop]
      })
    })

    it('puts listeners into this.events', () => {
      eventHandler.addListener('baz', trueop)
      eventHandler.events.should.eql({
        foo: [trueop, trueop],
        bar: [trueop],
        baz: [trueop]
      })
    })
  })

  describe('removeListener', () => {
    beforeEach(() => {
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', falseop)
      eventHandler.addListener('bar', trueop)
    })

    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({
        foo: [trueop, trueop, trueop, falseop],
        bar: [trueop]
      })
    })

    it('removes all instances of matching function', () => {
      eventHandler.removeListener('foo', trueop)
      eventHandler.events.should.eql({
        foo: [falseop],
        bar: [trueop]
      })
    })

    it('removes all instances of matching function using EventListener.destroy()', () => {
      const listener = eventHandler.addListener('bar', trueop)
      eventHandler.addListener('bar', falseop)
      listener.destroy()
      eventHandler.events.should.eql({
        foo: [trueop, trueop, trueop, falseop],
        bar: [falseop]
      })
    })
  })

  describe('removeEvent', () => {
    beforeEach(() => {
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('bar', trueop)
    })

    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({
        foo: [trueop, trueop],
        bar: [trueop]
      })
    })

    it('removes all listeners and the event', () => {
      eventHandler.removeEvent('foo')
      eventHandler.events.should.eql({
        bar: [trueop]
      })
    })
  })

  describe('removeAllEvents', () => {
    beforeEach(() => {
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('foo', trueop)
      eventHandler.addListener('bar', trueop)
    })

    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({
        foo: [trueop, trueop],
        bar: [trueop]
      })
    })

    it('resets this.events to {}', () => {
      eventHandler.removeAllEvents()
      eventHandler.events.should.eql({})
    })
  })

  describe('fire', () => {
    let returns = []
    const pushop = () => {
      returns.push(true)
    }
    const antipushop = () => {
      returns.push(false)
    }
    const noop = () => {}

    beforeEach(() => {
      returns = []
      eventHandler.addListener('foo', pushop)
      eventHandler.addListener('foo', antipushop)
      eventHandler.addListener('foo', noop)
      eventHandler.addListener('bar', pushop)
    })

    it('this.events setup correctly', () => {
      eventHandler.events.should.eql({
        foo: [pushop, antipushop, noop],
        bar: [pushop]
      })
    })

    it('executes listeners of event', () => {
      eventHandler.fire('foo')
      returns.should.eql([true, false])
    })

    /**
     * This test is 'hacky' as we are directly binding 'this' to the listener
     * as opposed to binding through the .addListener method. An array of issues
     * require us to use this hacky way:
     * - Eslint not supporting ES7 bind syntax (annoying warnings when linting)
     * - And mainly, ES6 fails to handle binding within EventHandler.addListener
     *   the way ES5 does
     */
    it('works with \'this\' context', () => {
      const theAge = function () {
        returns.push(`age_${7}${this}`)
      }

      eventHandler.addListener('first', theAge.bind(2))
      eventHandler.addListener('second', theAge.bind(3))

      eventHandler.fire('first')
      returns.should.eql(['age_72'])
      eventHandler.fire('second')
      returns.should.eql(['age_72', 'age_73'])
    })
  })
})

describe('EventHandler Clustered', () => {
  let returns = []
  const rtrueop = () => {
    returns.push(true)
  }
  const rfalseop = () => {
    returns.push(false)
  }
  const globalConfig = ['globalIdentifier', psuedoGlobal]
  const globalConfigAlt = ['globalIdentifierAlt', psuedoGlobal]
  let EH1
  let EH2
  let EH3
  let EH4

  beforeEach(() => {
    delete psuedoGlobal.globalIdentifier
    delete psuedoGlobal.globalIdentifierAlt

    returns = []
    EH1 = new EventHandler(...globalConfig)
    EH2 = new EventHandler(...globalConfig)
    EH3 = new EventHandler(...globalConfigAlt)
    EH4 = new EventHandler()
  })

  it('this.events setup correctly', () => {
    EH1.events.should.eql({})
    EH2.events.should.eql({})
    EH3.events.should.eql({})
    EH4.events.should.eql({})
  })

  describe('fire', () => {
    beforeEach(() => {
      EH1.addListener('event', rtrueop)
      EH2.addListener('event', rfalseop)
      EH3.addListener('event', rtrueop)
      EH4.addListener('event', rtrueop)
    })

    it('EventHandlers in clustered location', () => {
      psuedoGlobal.globalIdentifier.should.eql([EH1, EH2])
      psuedoGlobal.globalIdentifierAlt.should.eql([EH3])
    })

    it('executes all within clustered event', () => {
      EH1.fire('event')
      returns.should.eql([true, false])
    })

    it('executes with arguments from clustered EventHandler', () => {
      EH1.addListener('complexOp', (...args) => {
        returns.push(args.join(''))
      })
      EH2.fire('complexOp', null, '1', '2', '3')
      returns.should.eql(['123'])
    })
  })
})
