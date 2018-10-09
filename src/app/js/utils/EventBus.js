export default {
  element: document.createElement('div'),

  listen(event, method, scope) {
    this.element.addEventListener(event, method.bind(scope))
  },

  dispatch(event, data) {
    let customEvent = new CustomEvent(event, {detail: data || {}})
    this.element.dispatchEvent(customEvent)
  }
}