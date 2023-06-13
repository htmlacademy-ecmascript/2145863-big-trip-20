import Presenter from './presenter.js';
import {formatDateRange} from '../utils.js';

/**
 * @extends {Presenter<BriefView, AppModel>}
 */
class BriefPresenter extends Presenter {
  /**
   * @override
   * @returns {BriefViewState}
   */
  createViewState() {
    return {
      places: this.getPlaces(),
      dates: this.getDates(),
      cost: this.getCost(),
    };
  }

  /** @returns {string} */
  getPlaces() {
    return 'Amsterdam — Chamonix — Geneva';
  }

  /** @returns {string} */
  getDates() {
    const points = this.model.getPoints();
    if (points.length) {
      const startPoint = points.at(0);
      const endPoint = points.at(-1);

      return formatDateRange(startPoint.startDateTime, endPoint.endDateTime);
    }

    return '';
  }

  /** @returns {number} */
  getCost() {
    return 1230;
  }
}

export default BriefPresenter;
