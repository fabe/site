import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const data = {
  id: 'digitalmenu',
  isWork: true,
  devOnly: false,
  title: 'Creating a digital experience for restaurants',
  subtitle: 'Digital Menu',
  date: '2015-04-01',
  path: '/work/digital-menu',
  excerpt: `In the summer of 2015, together with Edmundo Galindo, I worked on a digital menu for a fictional burger restaurant. The project was envisioned during the class “Human-Computer Interaction Design”, supervised by Prof. Dr. Frank Heidmann.`,
  contain: false,
  background: '#111',
  details: [
    {
      title: 'Responsibility',
      description: 'UX Design, HCI, User Testing',
    },
    {
      title: 'Date',
      description: 'Summer 2015',
    },
  ],
};

export default props => (
  <Article path={data.path} {...props}>
    <Block mobilePull>
      <p>
        In the summer of 2015, together with{' '}
        <a href="https://twitter.com/EdmundoMGalindo">Edmundo Galindo</a>, I
        worked on a digital menu for a fictional burger restaurant. The project
        was envisioned during the class “Human-Computer Interaction Design”,
        supervised by Prof. Dr. Frank Heidmann.
      </p>
    </Block>
    <Block align="right">
      <p>
        At the beginning of the semester, we were asked come up with an exciting
        project or problem that we could tackle throughout the next months.
        After agreeing on the topic of digital menus for restaurants, we asked
        questions, identified problems and developed a solution by using the
        methods of Human-Centered Design.
      </p>
    </Block>
    <hr />
    <Block full>
      <Figure
        sizes={props.data.intro}
        caption="We started out creating personas and user stories to figure out requirements of the application."
      />
    </Block>
    <hr />
    <Block vc>
      <h3>Paper Prototyping</h3>
      <p>
        We created a paper prototype that helped us testing our concepts with
        potential customers.
      </p>
    </Block>
    <Block align="right">
      <Figure sizes={props.data.proto} />
    </Block>
    <hr />
    <Block full>
      <Figure
        background
        sizes={props.data.overview}
        caption="Using high quality imagery and an elegant, dark interface, we tried making the user excited for their meal."
      />
    </Block>
    <Block full>
      <Figure
        background
        sizes={props.data.description}
        caption="Using the digital medium, we were able to supply the users with more information if they require it (especially interesting for allergy sufferers)."
      />
    </Block>
    <Block full>
      <Figure
        background
        sizes={props.data.order}
        caption="Going full circle: We also took a look at how people can use the tablet to pay the bill and split it upon request."
      />
    </Block>
    <Block align="right">
      <p className="small">
        Photos &copy; by <a href="https://pech-sapel.de/">Pech und Sapel</a>,{' '}
        <a href="http://halfbakedharvest.com">halfbakedharvest.com</a>, {' '}
        <a href="http://theawesomegreen.com">theawesomegreen.com</a>,{' '}
        <a href="http://bojongourmet.com">bojongourmet.com</a>,{' '}
        <a href="http://ladyandpups.com">ladyandpups.com</a> and{' '}
        <a href="http://howsweeteats.com">howsweeteats.com</a>.
      </p>
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageMenu {
    intro: file(relativePath: { eq: "work/digital-menu/intro.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    proto: file(relativePath: { eq: "work/digital-menu/prototype.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    overview: file(relativePath: { eq: "work/digital-menu/overview.png" }) {
      childImageSharp {
        sizes(maxWidth: 1000, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    description: file(
      relativePath: { eq: "work/digital-menu/description.png" }
    ) {
      childImageSharp {
        sizes(maxWidth: 1000, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    order: file(relativePath: { eq: "work/digital-menu/order.png" }) {
      childImageSharp {
        sizes(maxWidth: 1000, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
