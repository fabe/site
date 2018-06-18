import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import SEO from '~/src/components/SEO';
import Layout from '~/src/components/Layout';
import clients from '~/static/clients.svg';

export default ({ posts, transition, data }) => (
  <Layout>
    <Helmet title="Fabian W. Schultz | About" />
    <SEO
      postPath="/about"
      postNode={{
        subtitle: 'About',
        excerpt: `I’ve been working both as a product designer and frontend developer for over 5 years now. I particularly enjoy working with companies that try to meet broad and unique user needs.`,
        cover: data.cover,
      }}
      pageSEO
    />
    <Header cover={data.cover}>
      <div className="title">
        <h1>About</h1>
      </div>
      <div className="intro">
        <ul>
          <li>Professional early adopter.</li>
          <li>Open Source on default.</li>
          <li>Didn’t buy Bitcoin in 2011.</li>
        </ul>
      </div>
    </Header>
    <article id="content">
      <div>
        <Block pull mobilePull>
          <Figure
            src={clients}
            captionLeft
            caption="Some of the companies I’ve worked with."
          />
        </Block>
        <Block align="right" pull mobilePull>
          <p>
            Hello, I’m Fabian &mdash; a product designer and developer based in
            Potsdam, Germany.
          </p>
          <p>
            I’ve been working both as a product designer and frontend developer
            for over 5 years now. I particularly enjoy working with companies
            that try to meet broad and unique user needs.
          </p>
          <p>
            Outside of working as a freelancer and studying at{' '}
            <a className="caps" href="//www.en.fh-potsdam.de">
              FHP
            </a>, I try to push out{' '}
            <Link to="/side-projects">Side Projects</Link> regularly.
          </p>
          <p>
            Using the power of design, I want to help make technology usable and
            accessible for everyone — hence my fondness for the web.
          </p>
          <p>
            I’m into working iteratively on projects, owning problems and
            solving them through interdisciplinary work and teams. For me it’s
            crucial to act at the intersection of design & code, sharpening my
            skills continuously in every direction.
          </p>
          <p>
            View my{' '}
            <a href="https://drive.google.com/open?id=19nybcDoTKPWsYAmq5nRmx23NwqYD32er">
              Résumé
            </a>{' '}
            or my{' '}
            <a href="https://www.linkedin.com/in/fabian-schultz">
              LinkedIn profile
            </a>.
          </p>
        </Block>
      </div>
    </article>
  </Layout>
);

export const query = graphql`
  query GatsbyImageHeroAboutQuery {
    cover: file(relativePath: { eq: "fabian-schultz.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 700, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
