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
    this.model.addEventListener('busy', this.onModelBusy.bind(this));
    this.model.addEventListener('idle', this.onModelIdle.bind(this));
  }

  onModelBusy() {
    this.isModelBusy = true;
    this.updateView();
  }

  onModelIdle() {
    this.isModelBusy = false;
    this.updateView();
  }
}

export default OverlayPresenter;
