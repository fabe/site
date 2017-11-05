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

  @action
  getArticleByPath(path) {
    return this.articles.find(article => article.node.data.path === path).node
      .data;
  }
}
