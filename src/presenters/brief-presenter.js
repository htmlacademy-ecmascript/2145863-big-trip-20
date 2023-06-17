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
    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();

    const names = points
      .map((point) => {
        const destination = destinations.find((it) => it.id === point.destinationId);

        return destination.name;
      })
      .filter((name, index, list) => {
        const nextName = list[index + 1];

        return name !== nextName;
      });

    if (names.length > 3) {
      names.splice(1, names.length - 2, '...');
    }

    return names.join(' — ');
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
    const points = this.model.getPoints();
    const offersGroups = this.model.getOfferGroups();

    const totalCost = points.reduce((costAcc, point) => {
      const {offers} = offersGroups.find((it) => it.type === point.type);
      const pointCost = offers.reduce((offersAcc, offer) => {
        if (point.offerIds.includes(offer.id)) {
          return offersAcc + offer.price;
        }
        return offersAcc;
      }, point.basePrice);

      return costAcc + pointCost;
    }, 0);

    return totalCost;
  }

  /**
   * @override
   */
  onWindowPopState() {}

  /**
   * @override
   */
  addEventListeners() {
    this.model.addEventListener('change', this.onModelChange.bind(this));
  }

  onModelChange() {
    this.updateView();
  }
}

export default BriefPresenter;
