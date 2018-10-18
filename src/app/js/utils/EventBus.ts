export default {
  element: document.createElement('div'),

  listen(event: string, method: (e?: CustomEvent) => void, scope?: any) {
    this.element.addEventListener(event, method.bind(scope));
  },

  dispatch(event: string, data?: any) {
    const customEvent = new CustomEvent(event, { detail: data || {} });
    this.element.dispatchEvent(customEvent);
  },
};
