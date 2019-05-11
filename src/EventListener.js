/**
 * Every listener is wrapped in this.
 *
 * @class EventListener
 */
class EventListener {
  constructor(EventHandler, name, fn) {
    this.EventHandler = EventHandler
    this.name = name
    this.fn = fn
  }

  /**
   * Destroys the listener from the applied EventListener
   *
   * @return {undefined}
   */
  destroy() {
    this.EventHandler.removeListener(this.name, this.fn)
    this.EventHandler = null
  }
}

export default EventListener
