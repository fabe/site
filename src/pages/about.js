import React from 'react';
import Header from '../components/Header';

export default ({ posts }) => (
  <div>
    <Header slim caption="Portofino, Italy">
      <h1>About</h1>
      <p>
        As a designer, I like to focus on projects in the travel and leisure
        industry. I work both as a product designer and a frontend developer.
        Take a look at my work here, or browse my side projects.
      </p>
      <p>
        Right now, I study Interface Design at the University of Applied
        Sciences in Potsdam and work as a freelancer.
      </p>
    </Header>
  </div>
);
