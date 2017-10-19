import React from 'react';
import Block from '~/src/components/Block';

class Bio extends React.Component {
  render() {
    return (
      <div className="bio">
        <Block>
          <h2>
            Hello, I'm Fabian — a product designer and developer based in
            Potsdam, Germany.
          </h2>
        </Block>
        <Block align="right">
          <p>
            As a designer, I like to focus on projects in the travel and leisure
            industry. I work both as a product designer and a frontend
            developer. Take a look at my work here, or browse my side projects.
            Right now, I study Interface Design at the University of Applied
            Sciences in Potsdam and work as a freelancer.
          </p>
        </Block>
      </div>
    );
  }
}

export default Bio;
