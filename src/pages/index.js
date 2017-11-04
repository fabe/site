import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { observer, inject } from 'mobx-react';

import Header from '../components/Header';
import Bio from '../components/Bio';
import Posts from '../components/Posts';

@inject('store')
@observer
class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.store.site.siteMetadata.title');
    const articles = get(this, 'props.store.articles');
    const { transition } = this.props;

    return (
      <div style={transition && transition.style}>
        <Helmet title={get(this, 'props.store.site.siteMetadata.title')} />
        <Header>
          <div className="title">
            <h1>
              Hello, I'm Fabian &mdash; a{' '}
              <em>product designer and developer</em> based in Potsdam, Germany.
            </h1>
          </div>
          <div className="summary">
            <p>
              As a designer, I like to focus on projects in the travel and
              leisure industry. I work both as a product designer and a frontend
              developer. Take a look at my work here, or browse my side
              projects.
            </p>
          </div>
        </Header>
        <Posts posts={articles} />
      </div>
    );
  }
}

BlogIndex.propTypes = {
  route: PropTypes.object,
};

export default BlogIndex;
