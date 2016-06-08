'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EventCluster
 */

var EventCluster = function EventCluster(EventHandler, identifier, context) {
  _classCallCheck(this, EventCluster);

  var self = this;
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
  this.fire = function (name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    self.cluster.forEach(function (value) {
      if (value.events.hasOwnProperty(name)) {
        value.fire.apply(value, ['$clusterFire__' + name].concat(args));
      }
    });
  };
};

module.exports = EventCluster;