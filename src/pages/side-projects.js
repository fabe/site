import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import clients from '~/static/clients.svg';

export default ({ posts, transition, data, pathContext }) => (
  <div style={transition && transition.style}>
    <Helmet title="Fabian W. Schultz | Side Projects" />
    <article id="content">
      <div>
        <Block>
          <h1>Side Projects</h1>
          <h2>NPR Player</h2>
          <p>
            A chrome extension to stream NPR. Used by{' '}
            {pathContext.nprUsers || 'thousands of'} people.
          </p>
        </Block>
      </div>
    </article>
  </div>
);
