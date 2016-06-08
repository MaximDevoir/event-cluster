'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListener = require('./EventListener');
var EventCluster = require('./EventCluster');
var toString = Object.prototype.toString;

/**
 * EventHandler
 */

var EventHandler = function () {
  function EventHandler(clusterIdentifier, clusterContext) {
    _classCallCheck(this, EventHandler);

    this.events = {};
    this.cluster = null;

    if (toString.call(clusterContext) === "[object Object]") {
      this.cluster = new EventCluster(this, clusterIdentifier, clusterContext);
    }
  }

  /**
   * Get an array of functions assigned to an event.
   * If no listeners exist the event is added.
   * @param  {String} name Name of event
   * @return {Array}       Listeners of event
   */


  EventHandler.prototype.getListeners = function getListeners(name) {
    return this.events[name] || (this.events[name] = []);
  };

  /**
   * Add a function to listen for an event.
   * @param {String}   name    Name of event
   * @param {Function} fn      Executed when event for name is fired
   * @param {Object}   context Reference object
   * @return {EventListener}   Returns this
   */


  EventHandler.prototype.addListener = function addListener(name, fn, context) {
    var listeners = this.getListeners(name);

    fn.bind(context);
    listeners.push(fn);
    return new EventListener(this, name, fn);
  };

  /**
   * Removes all instances of listener from an event
   * @param  {String}   name Event name
   * @param  {Function} fn   The function to remove
   * @return {EventHandler}  Returns this
   */


  EventHandler.prototype.removeListener = function removeListener(name, fn) {
    var listeners = this.getListeners(name);

    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === fn) {
        listeners.splice(i, 1);
      }
    }
    return this;
  };

  /**
   * Remove a single function from a listener
   * @param  {String} name  The name of the event to remove func from
   * @return {EventHandler} Returns this
   */


  EventHandler.prototype.removeEvent = function removeEvent(name) {
    delete this.events[name];
    return this;
  };

  /**
   * Resets all listeners
   * @return {EventHandler} Returns this
   */


  EventHandler.prototype.removeAllEvents = function removeAllEvents() {
    this.events = {};
    return this;
  };

  /**
   * Fires event, all fn's listening to the event will be executed.
   * @param {String}    name    The name of the listener
   * @param {Object}    thisArg Reference
   * @param {...args}   args    Any other arguments passed will be applied to
   *                            the listening functions.
   * @return {EventHandler}     Returns this
   */


  EventHandler.prototype.fire = function fire(name, thisArg) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var clusterCode = name.substring(0, '$clusterFire__'.length);
    var clusterEvent = name;

    if (this.cluster && clusterCode !== '$clusterFire__') {
      var _cluster;

      (_cluster = this.cluster).fire.apply(_cluster, arguments);

      // End execution to avoid double-execution
      return this;
    } else if (this.cluster && clusterCode === '$clusterFire__') {
      clusterEvent = name.slice('$clusterFire__'.length);
    }

    var listeners = this.getListeners(clusterEvent);
    listeners.forEach(function (listener) {
      listener.apply(thisArg, args);
    });
    return this;
  };

  return EventHandler;
}();

module.exports = EventHandler;