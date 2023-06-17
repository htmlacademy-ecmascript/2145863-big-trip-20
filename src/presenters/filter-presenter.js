import Presenter from './presenter.js';

/**
 * @extends {Presenter<FilterView, AppModel>}
 */
class FilterPresenter extends Presenter {
  /**
   * @override
   * @returns {FilterViewState}
   */
  createViewState() {
    /** @type {UrlParams} */
    const {filter = 'everything'} = this.getUrlParams();

    /**
     * @type {Array<FilterType>}
       */
    const types = ['everything', 'future', 'present', 'past'];

    const items = types.map((it) => ({
      value: it,
      isSelected: it === filter,
      isDisabled: this.model.getPoints({filter: it}).length === 0,
    }));

    return {items};
  }

  /**
   * @param {Event & {target: {value: FilterType}}} event
   */
  onViewChange(event) {
    /** @type {UrlParams} */
    const urlParams = {
      filter: event.target.value
    };

    urlParams.filter = event.target.value;
    delete urlParams.edit;
    this.setUrlParams(urlParams);
  }

  /**
   * @override
   */
  addEventListeners() {
    this.view.addEventListener('change', this.onViewChange.bind(this));
  }
}

export default FilterPresenter;
