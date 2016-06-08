"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EventListener
 */

var EventListener = function () {
  function EventListener(EventHandler, name, fn) {
    _classCallCheck(this, EventListener);

    this.EventHandler = EventHandler;
    this.name = name;
    this.fn = fn;
  }

  /**
   * Destroys the listener from the applied EventListener
   * @return {undefined}
   */


  EventListener.prototype.destroy = function destroy() {
    this.EventHandler.removeListener(this.name, this.fn);
    this.EventHandler = null;
  };

  return EventListener;
}();

module.exports = EventListener;