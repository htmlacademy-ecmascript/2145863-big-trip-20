import Presenter from './presenter.js';

/**
 * @extends {Presenter<SortView>}
*/
class SortPresenter extends Presenter {
  /**
   * @override
   * @returns {SortViewState}
  */
  createViewState() {
    /**
     * @type Array<SortType>
     */
    const types = ['day', 'event', 'time', 'price', 'offers'];

    const items = types.map((it) => ({
      value: it,
      isSelected: it === 'day',
      isDisabled: it === 'time' || it === 'offers',
    }));

    return {items};
  }
}

export default SortPresenter;
