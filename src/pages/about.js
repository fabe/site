import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import SEO from '~/src/components/SEO';
import clients from '~/static/clients.svg';

export default ({ posts, transition, data }) => (
  <div style={transition ? transition.style : { opacity: 0 }}>
    <Helmet title="Fabian Schultz | About" />
    <SEO
      postPath="/about"
      postNode={{
        subtitle: 'About',
        excerpt: `Hello! I’m a designer & developer focused on turning ideas into delightful, practical software. I’m doing my best work when collaborating closely with founders, designers, and developers.`,
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
          <li>Indecisive about his job title.</li>
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
            Hello! I’m a designer & developer focused on turning ideas into
            delightful, practical software. I’m doing my best work when
            collaborating closely with founders, designers, and developers.
          </p>
          <p>
            Recently, I was a Technology Intern at{' '}
            <a href="//stinkstudios.com">Stink Studios</a> in New York City,
            working with brands like Google and Spotify. I’m currently working
            towards my BA in Interface Design in Potsdam, Germany.
          </p>
          <p>
            Before that, I freelanced as a designer/front-end developer hybrid,
            helping companies such as <a href="//seatgeek.com">SeatGeek</a>,{' '}
            <a href="//wimdu.com">Wimdu</a>, <a href="//z.cash">Zcash</a>, and{' '}
            <a href="//door2door.io">door2door</a>.
          </p>
          <p>
            <a href="https://drive.google.com/open?id=19nybcDoTKPWsYAmq5nRmx23NwqYD32er">
              Résumé
            </a>{' '}
            · <a href="https://www.linkedin.com/in/fabian-schultz">LinkedIn</a>
          </p>
        </Block>
      </div>
    </article>
  </div>
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
