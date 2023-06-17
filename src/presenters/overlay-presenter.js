import Presenter from './presenter.js';

/**
 * @extends {Presenter<OverlayView, AppModel>}
 */
class OverlayPresenter extends Presenter {

  /** @type {boolean} */
  isModelBusy;

  /**
   * @override
   * @returns {OverlayViewState}
   */
  createViewState() {
    return {
      isActive: this.isModelBusy,
    };
  }

  /**
   * @override
   */
  addEventListeners() {
    this.model.addEventListener('busy', this.handlerModelBusy.bind(this));
    this.model.addEventListener('idle', this.handlerModelIdle.bind(this));
  }

  handlerModelBusy() {
    this.isModelBusy = true;
    this.updateView();
  }

  handlerModelIdle() {
    this.isModelBusy = false;
    this.updateView();
  }
}

export default OverlayPresenter;
