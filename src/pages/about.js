import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import clients from '~/static/clients.svg';

export default ({ posts, transition, data }) => (
  <div style={transition && transition.style}>
    <Helmet title="Fabian W. Schultz | About" />
    <Header cover={data.hero}>
      <div className="title">
        <h1>About</h1>
      </div>
      <div className="summary">
        <p>
          Looking out the window,<br />probably thinking about grids.
        </p>
      </div>
    </Header>
    <article id="content">
      <div>
        <Block mobilePull>
          <Figure
            src={clients}
            captionLeft
            caption="Some of the companies I’ve worked with."
          />
        </Block>
        <Block align="right">
          <p>
            Hello, I’m Fabian &mdash; a product designer and developer based in
            Potsdam, Germany.
          </p>
          <p>
            I’ve been working both as a product designer and frontend developer
            for over 5 years now. I particularly enjoy working with companies
            that build products for the travel and leisure industry.
          </p>
          <p>
            Using the power of design, I want to help make technology usable and
            accessible for everyone — hence my fondness for the web.
          </p>
          <p>
            I’m into working <em>iteratively</em> on projects, owning problems
            and solving them through interdisciplinary work and teams.
          </p>
        </Block>
      </div>
    </article>
  </div>
);

export const query = graphql`
  query GatsbyImageHeroAboutQuery {
    hero: file(relativePath: { eq: "hero-about-slim.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 700, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
