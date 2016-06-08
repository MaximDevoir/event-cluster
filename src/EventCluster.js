/**
 * EventCluster
 */
class EventCluster {

  constructor(EventHandler, identifier, context) {
    let self = this;
    this.EventHandler = EventHandler;
    context[identifier] = context[identifier] || [];
    this.cluster = context[identifier];
    this.cluster.push(this.EventHandler);

    /**
     * Fire a clustered event. Relays the arguments to the fire method within each
     * clustered EventListener.
     * @param  {String}    name Name of event
     * @param  {...*} args Argumens to pass onto listeners
     * @return {undefined} Nothing is returned
     */
    this.fire = (name, ...args) => {
      self.cluster.forEach(function(value) {
        if(value.events.hasOwnProperty(name)){
          value.fire('$clusterFire__' + name, ...args);
        }
      });
    };
  }
}

module.exports = EventCluster;
