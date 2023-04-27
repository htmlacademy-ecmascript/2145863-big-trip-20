import FilterView from './view/filter-view.js';
import EventsListPresenter from './presenter/events-list-presenter.js';

import { render } from './render.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsListPresenter({eventsContainer: siteMainElement});

render(new FilterView(), siteHeaderElement);
eventsPresenter.init();
