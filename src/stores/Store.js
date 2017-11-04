import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

export default class Store {
  @persist('list')
  @observable
  articles = [];

  @persist('object')
  @observable
  site = {};

  @action
  setArticles(articles) {
    this.articles = articles;
  }

  @action
  setSite(site) {
    this.site = site;
  }
}
