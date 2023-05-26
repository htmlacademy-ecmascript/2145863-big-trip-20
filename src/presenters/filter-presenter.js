import Presenter from './presenter.js';

/**
 * @extends {Presenter<FilterView>}
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
      isDisabled: false,
    }));

    return {items};
  }

  /**
   *
   * @param {Event & {target: {value: FilterType}}} event
   */
  handleViewChange(event) {
    /** @type {UrlParams} */
    const UrlParams = {
      filter: event.target.value
    };

    UrlParams.filter = event.target.value;
    delete UrlParams.edit;
    this.setUrlParams(UrlParams);
  }

  /**
   * @override
   */
  addEventListeners() {
    this.view.addEventListener('change', this.handleViewChange.bind(this));
  }
}

export default FilterPresenter;
