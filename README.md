# EventHandler

A module to handle events written in JavaScript.

# Installation
```
npm install bitbucket:maximdevoir/event-cluster
```

# API

Start using EventHandler

```
import EventHandler from 'event-cluster';
const MyHandler = new EventHandler();
```

Start listening to an event with `.addListener`.
```
MyHandler.addListener('eventName', ...args => {
  console.log(args);
});
```

To call onto the listeners use the `.fire` method.
```
MyHandler.fire('eventName', thisArg, ...args);
```

`thisArg` is not required but you will have to pass in undefined when you don't want to provide context.
```
MyHandler.fire('eventName', undefined, ...args);
```


# Event Clustering
A big feature of EventHandler is its ability to cluster with other EventHandlers.
An example of when you would want to cluster EventHandlers is when the EventHandlers are instantiated in different contexts and you want the EventHandlers to share their events.
To do this you must pass in a `clusterIdentifier`, a name for the cluster, and `clusterContext`, an object the EventHandlers can attatch to.
```
// new EventHandler(clusterIdentifier, clusterContext);

// somewhere in the codebase
import EventHandler from 'event-cluster';
const MyHandler = new EventHandler('clusterName', window);

// somewhere else in the codebase
import EventHandler from 'event-cluster';
const MyHandler1 = new EventHandler('clusterName', window);

```

Now, when you fire from `MyHandler` it will fire not just the listeners of `MyHandler` but also `MyHandler1` and any other handlers in the cluster.

## Behind the Scenes
What does the module do with `clusterContext`.
```
import EventHandler from 'event-cluster';
const Handler = new EventHandler('prompt', window);
```

The handler will attatch istelf to the `window` under the `prompt` key. However, 'prompt' is already a part of the window object.

To combat this error, EventHandler will internally prefix Clustered EventHandlers with `__clusterFire__`. Example, when attatching to `window` it would be `window.__clusterFire__prompt`.

# TODO
* Add clustering ability to individual events.
* Better documentation
