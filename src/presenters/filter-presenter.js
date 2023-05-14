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
    // TODO: FilterViewState
    /**
     * @type {Array<FilterType>}
     */
    const types = ['everything', 'future', 'present', 'past'];

    const items = types.map((it) => ({
      value: it,
      isSelected: it === 'everything',
      isDisabled: it === 'future',
    }));

    return {items};
  }
}

export default FilterPresenter;
