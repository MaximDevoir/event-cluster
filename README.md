# Event Cluster

> An event handler featuring event listening and firing, clustering of events
> anywhere, and the ability for multiple event-clusters to work together.

[![license](https://badgen.net/badge/license/MIT/blue)](https://www.npmjs.com/package/event-cluster)
[![bundlephobia minzip](https://badgen.net/bundlephobia/minzip/event-cluster)](https://bundlephobia.com/result?p=event-cluster)
[![npm dependents](https://badgen.net/npm/dependents/event-cluster)](https://www.npmjs.com/package/event-cluster?activeTab=dependents)
[![downloads](https://badgen.net/npm/dt/event-cluster)](https://www.npmjs.com/package/event-cluster)
[![Coverage Status](https://coveralls.io/repos/github/MaximDevoir/event-cluster/badge.svg?branch=master)](https://coveralls.io/github/MaximDevoir/event-cluster?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/MaximDevoir/event-cluster/badge.svg)](https://snyk.io/test/github/MaximDevoir/event-cluster)

## Installation

```shell
yarn add event-cluster
```

## Usage

Start using EventHandler

```javascript
import EventHandler from 'event-cluster'

const MyHandler = new EventHandler()

// Begin listening to an event with `.addListener`.

MyHandler.addListener('eventName', ...args => {
  console.log(args)
})

// To call onto event listeners use the `.fire` method.

MyHandler.fire('eventName', thisArg, ...args)

// `thisArg` is not required but you will have to pass in undefined when you
// don't want to provide context.

MyHandler.fire('eventName', undefined, ...args)
```

## API

### EventHandler

`EventHandler(?clusterIdentifier, ?clusterContext)`

`.getListeners(name)`: Get an array of functions assigned to an event. If the
event does not exist, it is created.

`.addListener(name, fn, context)`: Add a function to listen for an event.

`.removeListener(name, fn)`: Removes all instances of the listener, `fn`, from
event `name`.

`.removeEvent(name)`: Removes all listeners from and event `name`.

`.removeAllEvents()`: Resets all listeners.

`.fire(name, thisArg, ...args)`: Fires an event `name`, where all functions
listening to the event will be `.called(thisArg, args)`.

## Event Clustering

A big feature of EventHandler is its ability to cluster with other
EventHandlers. A common use case would be when you want multiple EventHandlers
in different locations, or contexts, to share their events.

To do this you must pass in a `clusterIdentifier`, a name for the cluster, and
`clusterContext`, an object the EventHandlers can attach to.

```javascript
// moduleA.js
import EventHandler from 'event-cluster'

const ModuleAHandler = new EventHandler('clusterName', window)

ModuleAHandler.addListener('theEvent', postMessage => {
  console.log(`Event fired - module A. ${postMessage}`)
})


// moduleB.js
import EventHandler from 'event-cluster'

const ModuleBHandler = new EventHandler('clusterName', window)

ModuleBHandler.addListener('theEvent', postMessage => {
  console.log(`Event fired - module B. ${postMessage}`)
})

// From somewhere else in the codebase
EventHandler(...).fire('theEvent', undefined, 'Awesome!')

// log =>  Event fired - module A. Awesome!
// log =>  Event fired - module B. Awesome!
```

### Behind the Scenes

What does the module do with `clusterContext`.

```javascript
import EventHandler from 'event-cluster'

const Handler = new EventHandler('prompt', window)
```

The handler will attach itself to the `window` under the `prompt` key. However,
'prompt' is already a part of the window object.

To combat this error, EventHandler will internally prefix Clustered
EventHandlers with `__clusterFire__`. Example, when attaching to `window` it
would be `window.__clusterFire__prompt`.
