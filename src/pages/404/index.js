import React from 'react';
import Header from '~/src/components/Header';
import omg from './omg.mp4';

export default ({ posts }) => (
  <div>
    <Header caption="Troll 2" video={omg}>
      <h1 className="h3">404</h1>
      <p>That wasn't found.</p>
    </Header>
  </div>
);
