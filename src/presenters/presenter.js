/**
 * @abstract
 * @template {View} V
 * @template {Model} M
 */
class Presenter {
  /**
   * @param {V} view
   * @param {M} model
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.addEventListeners();
    globalThis.queueMicrotask(() => this.updateView());

    window.addEventListener('popstate', () => this.updateView());
  }

  updateView() {
    this.view.state = this.createViewState();
    this.view.render();
  }

  /**
   * @abstract
   */
  createViewState() {
    return null;
  }

  /**
   * @abstract
   */
  addEventListeners() {}

  /**
   * @param {Object<string, string>} params
   */
  setUrlParams(params) {
    const url = this.getUrl();

    url.search = '';

    Object.keys(params).forEach((key) => {
      url.searchParams.set(key, params[key]);
    });

    window.history.pushState(null, '', url.href);
    // событие 'popstate' возникает только при интерактивной навигации по истории
    // или когда используются методы типа history.go(). history.PushState()
    // меняет адресную строку и вносит запись в стек history, но 'popstate'
    // требуется задиспачить самостоятельно вручную
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  //QUESTION: pushState - асинхронный метод, по логике он будет выполнен позже dispatchEvent, так как будет поставлен в очередь микрозадач

  /**
   * @return {Object<string, string>}
   */
  getUrlParams() {
    const url = this.getUrl();

    return Object.fromEntries(url.searchParams);
  }

  /**
   * @return {URL}
   */
  getUrl() {
    return new URL(window.location.href);
  }

}

export default Presenter;
