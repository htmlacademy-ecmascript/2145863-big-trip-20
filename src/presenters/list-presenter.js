import {formatDate, formatDuration, formatTime} from '../utils.js';
import Presenter from './presenter.js';

/**
 * @extends {Presenter<ListView, AppModel>}
 */
class ListPresenter extends Presenter {
  /**
   * @override
  * @returns {ListViewState}
   */
  createViewState() {
    /** @type {UrlParams} */
    const urlParams = this.getUrlParams();
    const points = this.model.getPoints(urlParams);
    const items = points.map(this.createPointViewState, this);

    if (urlParams.edit === 'draft') {
      /** @type {Partial<Point>} */
      const draftPoint = {
        type: 'taxi',
        offerIds: [],
        isFavorite: false,
      };
      items.unshift(this.createPointViewState(draftPoint));
    }

    return {items};
  }

  /**
   * @param {Partial<Point>} point
   * @returns {PointViewState}
   */
  createPointViewState(point) {
    const offerGroups = this.model.getOfferGroups();

    const types = offerGroups.map((it)=> ({
      value: it.type,
      isSelected: it.type === point.type,
    }));

    const destinations = this.model.getDestinations().map((it) => ({
      ...it,
      isSelected: it.id === point.destinationId,
    }));

    const group = offerGroups.find((it)=> it.type === point.type);
    const offers = group.offers.map((it) => ({
      ...it,
      isSelected: point.offerIds.includes(it.id),
    }));

    /** @type {UrlParams} */
    const urlParams = this.getUrlParams();
    const isDraft = point.id === undefined;
    const isEditable = isDraft || point.id === urlParams.edit;

    return {
      id: point.id,
      types,
      destinations: structuredClone(destinations),
      startDateTime: point.startDateTime,
      endDateTime: point.endDateTime,
      startDate: formatDate(point.startDateTime),
      startTime: formatTime(point.startDateTime),
      endTime: formatTime(point.endDateTime),
      duration: formatDuration(point.startDateTime, point.endDateTime),
      basePrice: point.basePrice,
      offers,
      isFavorite: point.isFavorite,
      isEditable,
      isDraft,
    };
  }

  /**
   * @param {PointViewState} point
   * @returns {Point}
   */
  serializePointViewState(point) {
    return {
      id: point.id,
      type: point.types.find((it) => it.isSelected).value,
      destinationId: point.destinations.find((it) => it.isSelected)?.id,
      startDateTime: point.startDateTime,
      endDateTime: point.endDateTime,
      basePrice: point.basePrice,
      offerIds: point.offers.filter((it) => it.isSelected).map((it) => it.id),
      isFavorite: point.isFavorite,
    };
  }

  /**
   * @override
   */
  addEventListeners() {
    this.view.addEventListener('open', this.onViewOpen.bind(this));
    this.view.addEventListener('close', this.onViewClose.bind(this));
    this.view.addEventListener('favorite', this.onViewFavorite.bind(this));
    this.view.addEventListener('edit', this.onViewEdit.bind(this));
    this.view.addEventListener('save', this.onViewSave.bind(this));
    this.view.addEventListener('delete', this.onViewDelete.bind(this));
  }

  /**
   * @param {CustomEvent & {target: CardView}} event
   */
  onViewOpen(event) {
    /** @type {UrlParams} */
    const urlParams = this.getUrlParams();

    urlParams.edit = event.target.state.id;
    this.setUrlParams(urlParams);
  }

  onViewClose() {
    /** @type {UrlParams} */
    const urlParams = this.getUrlParams();

    delete urlParams.edit;
    this.setUrlParams(urlParams);
  }

  /**
   * @param {CustomEvent & {target: CardView}} event
   */
  async onViewFavorite(event) {
    const card = event.target;
    const point = card.state;

    try {
      point.isFavorite = !point.isFavorite;
      await this.model.updatePoint(this.serializePointViewState(point));
      card.render();

    } catch(error) {
      card.shake();
    }
  }

  /**
   * @param {CustomEvent<HTMLInputElement> & {target: EditorView}} event
   */
  onViewEdit(event) {
    const editor = event.target;
    const field = event.detail;
    const point = editor.state;

    switch (field.name) {
      case 'event-type' : {
        const offerGroups = this.model.getOfferGroups();
        const {offers} = offerGroups.find((it) => it.type === field.value);

        point.offers = offers;
        point.types.forEach((it) => {
          it.isSelected = it.value === field.value;
        });
        editor.renderTypeAndRelatedFields();
        break;
      }

      case 'event-destination' : {
        const name = field.value.trim();

        point.destinations.forEach((it) => {
          it.isSelected = it.name === name;
        });
        editor.renderDestination();
        break;
      }

      case 'event-start-time': {
        point.startDateTime = field.value;
        break;
      }

      case 'event-end-time': {
        point.endDateTime = field.value;
        break;
      }

      case 'event-price': {
        point.basePrice = Number(field.value);
        break;
      }

      case 'event-offer': {
        const offer = point.offers.find((it) => it.id === field.value);
        offer.isSelected = !offer.isSelected;
        break;
      }

    }
  }

  /**
   * @param {CustomEvent & {target: EditorView}} event
   */
  async onViewSave(event) {
    const editor = event.target;
    const point = editor.state;

    try {
      event.preventDefault();

      point.isSaving = true;
      editor.renderSubmitButton();

      if (point.isDraft) {
        await this.model.addPoint(this.serializePointViewState(point));
      } else {
        await this.model.updatePoint(this.serializePointViewState(point));
      }

      this.onViewClose();

    } catch (error) {
      point.isSaving = false;
      editor.renderSubmitButton();
      editor.shake();
    }

  }

  /**
   * @param {CustomEvent & {target: EditorView}} event
   */
  async onViewDelete(event) {
    const editor = event.target;
    const point = editor.state;

    try {
      event.preventDefault();
      point.isDeleting = true;
      editor.renderResetButton();

      await this.model.deletePoint(point.id);
      this.onViewClose();

    } catch(error) {
      point.isDeleting = false;
      editor.renderResetButton();
      editor.shake();
    }
  }

}

export default ListPresenter;
