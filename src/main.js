import './views/brief-view.js';
import './views/add-view.js';
import './views/filter-view.js';
import './views/sort-view.js';
import './views/list-view.js';
import './views/placeholder-view.js';

import ApiService from './services/api-service.js';
import AppModel from './models/app-model.js';

import AddPresenter from './presenters/add-presenter.js';
import BriefPresenter from './presenters/brief-presenter.js';
import FilterPresenter from './presenters/filter-presenter.js';
import ListPresenter from './presenters/list-presenter.js';
import SortPresenter from './presenters/sort-presenter.js';
import PlaceholderPresenter from './presenters/placeholder-presenter.js';

const apiService = new ApiService({authorization: 'Basic er533jdzbdw'});
const appModel = new AppModel(apiService);

new PlaceholderPresenter(document.querySelector('placeholder-view'), appModel);
appModel.load().then(()=> {
  new AddPresenter(document.querySelector('add-view'));
  new BriefPresenter(document.querySelector('brief-view'));
  new FilterPresenter(document.querySelector('filter-view'));
  new SortPresenter(document.querySelector('sort-view'));
  new ListPresenter(document.querySelector('list-view'), appModel);
});
