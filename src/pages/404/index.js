import React from 'react';
import Header from '~/src/components/Header';
import HGroup from '~/src/components/HGroup';
import omg from './omg.mp4';

export default ({ posts }) => (
  <div>
    <Header video={omg}>
      <div className="title">
        <h1>404</h1>
      </div>
      <div className="summary">
        <p>That wasn't found.</p>
      </div>
    </Header>
  </div>
);
