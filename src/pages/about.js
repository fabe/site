import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import clients from '~/static/clients.svg';

export default ({ posts, transition }) => (
  <div style={transition && transition.style}>
    <Helmet title="Fabian W. Schultz | About" />
    <Header>
      <div className="title">
        <h1>About</h1>
      </div>
      <div className="summary">
        <p>
          As a designer, I like to focus on projects in the travel and leisure
          industry. I work both as a product designer and a frontend developer.
          Take a look at my work here, or browse my side projects.
        </p>
        <p>
          Right now, I study Interface Design at the University of Applied
          Sciences in Potsdam and work as a freelancer.
        </p>
      </div>
    </Header>
    <article id="content">
      <div>
        <hr />
        <Block align="center">
          <h6>Some of the companies I've worked with:</h6>
          <Figure marginTop src={clients} />
        </Block>
        <hr />
      </div>
    </article>
  </div>
);
