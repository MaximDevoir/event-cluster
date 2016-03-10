const EventListener = require('./EventListener');
const EventCluster = require('./EventCluster');
const toString = Object.prototype.toString;

class EventHandler {

  constructor(clusterIdentifier, clusterContext) {
    this.events = {};
    this.cluster = null;

    if(toString.call(clusterContext) === "[object Object]") {
      this.cluster = new EventCluster(this, clusterIdentifier, clusterContext);
    }
  }

  /**
   * Get an array of functions assigned to an event.
   * If no listeners exist the event is added.
   * @param  {String} name Name of event
   * @return {Array}       Listeners of event
   */
  getListeners(name) {
    return this.events[name] || (this.events[name] = []);
  }

  /**
   * Add a function to listen for an event.
   * @param {String}   name    Name of event
   * @param {Function} fn      Executed when event for name is fired
   * @param {Object}   context Reference object
   * @return {EventListener}   Returns this
   */
  addListener(name, fn, context) {
    const listeners = this.getListeners(name);

    fn.bind(context);
    listeners.push(fn);
    return new EventListener(this, name, fn);
  }

  /**
   * Removes all instances of listener from an event
   * @param  {String}   name Event name
   * @param  {Function} fn   The function to remove
   * @return {EventHandler}  Returns this
   */
  removeListener(name, fn) {
    const listeners = this.getListeners(name);

    for(let i = listeners.length - 1; i >= 0; i--) {
      if(listeners[i] === fn) {
        listeners.splice(i, 1);
      }
    }
    return this;
  }

  /**
   * Remove a single function from a listener
   * @param  {String} name  The name of the event to remove func from
   * @return {EventHandler} Returns this
   */
  removeEvent(name) {
    delete this.events[name];
    return this;
  }

  /**
   * Resets all listeners
   * @return {EventHandler} Returns this
   */
  removeAllEvents() {
    this.events = {};
    return this;
  }

  /**
   * Fires event, all fn's listening to the event will be executed.
   * @param {String}    name    The name of the listener
   * @param {Object}    thisArg Reference
   * @param {...args}   args    Any other arguments passed will be applied to
   *                            the listening functions.
   * @return {EventHandler}     Returns this
   */
  fire(name, thisArg, ...args) {
    let clusterCode = name.substring(0, '$clusterFire__'.length);
    let clusterEvent = name;

    if(this.cluster && clusterCode !== '$clusterFire__') {
      this.cluster.fire(...arguments);

      // End execution to avoid double-execution
      return this;
    } else if(this.cluster && clusterCode === '$clusterFire__') {
      clusterEvent = name.slice('$clusterFire__'.length);
    }

    const listeners = this.getListeners(clusterEvent);
    listeners.forEach(listener => {
      listener.apply(thisArg, args);
    });
    return this;
  }
}

module.exports = EventHandler;
