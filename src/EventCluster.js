/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */

/**
 * EventCluster
 *
 * TODO: Make it so you don't have to create an EventListener to fire off a
 * cluster event. Solution?: Export EventCluster in EventHandler and a static
 * fire function to fire an event. Example
 * EventHandler.fireClusterEvent(clusterIdentifier, clusterContext)
 *
 * See https://github.com/MaximDevoir/event-cluster/issues/4
 */
class EventCluster {
  /**
   * Creates an instance of EventCluster.
   *
   * @param {EventHandler} EventHandler A reference to the EventHandler spawned
   * by EventCluster.
   * @param {string} identifier An identifier for the cluster.
   * @param {object} context The context where the cluster will be stored.
   * @memberof EventCluster
   */
  constructor(EventHandler, identifier, context) {
    let self = this
    this.EventHandler = EventHandler
    context[identifier] = context[identifier] || []
    this.cluster = context[identifier]
    this.cluster.push(this.EventHandler)

    /**
     * Fire a clustered event. Relays the arguments to the fire method within each
     * clustered EventListener.
     * @param  {String}    name Name of event
     * @param  {...*} args Arguments to pass onto listeners
     * @return {undefined} Nothing is returned
     */
    this.fire = (name, ...args) => {
      self.cluster.forEach((value) => {
        if (value.events.hasOwnProperty(name)) {
          value.fire(`__clusterFire__${name}`, ...args)
        }
      })
    }
  }
}

module.exports = EventCluster
