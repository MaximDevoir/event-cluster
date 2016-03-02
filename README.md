# EventHandler

A module to handle events written in JavaScript.

# API

To start using EventHandler you must first construct it.

```var EventHandler = new (require('EventHandler'));```

From here you can create a new event by using `.addListener` or `.getListeners`.


getListeners will create an event if the requested event does not exist.
``EventHandler.getListeners('emptyEvent'); // Returns []``

``EventHandler.addListener('eventName', function() {}, thisArg)``

# TODO
* Add clustering ability to individual events.
