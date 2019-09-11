import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const frontmatter = {
  id: 'localhost',
  isWork: true,
  subtitle: 'localhost',
  title: 'Host and connect with your co-workers around the world',
  date: '2018-12-12',
  cover: './localhost.png',
  path: '/work/localhost',
  excerpt: ``,
  details: [
    {
      title: 'Responsibility',
      description: 'Co-Founder, Brand, Product Design, Frontend',
    },
    {
      title: 'Date',
      description: 'Since 2016',
    },
    {
      title: 'Technology',
      description: 'Figma, React, Apollo',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        Together with team of current and previous Google employees, I
        co-founded a platform that helps Googlers host and connect with their
        co-workers when they’re on business or leisure trips.
      </p>
    </Block>
    <Block align="right">
      <p>
        In 2019, We decided to completely rebuild the platform. I took charge of
        the brand, design, and frontend development. The design process was very
        much focused on making it as easy as possible to build and relaunch the
        web application.
      </p>
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>Brand</h2>
      <p>A new, friendly face for localhost.</p>
    </Block>
    <Block align="center" pull>
      <Figure sizes={props.data.logo} />
      <Figure sizes={props.data.landing} />
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>The Platform</h2>
      <p>
        Using the learnings from our extensive MVP, I was able to design a
        platform focused on what’s needed most, free from any distractions.
      </p>
    </Block>
    <Block align="center" pull>
      <Figure sizes={props.data.ui1} />
      <Figure sizes={props.data.ui2} />
    </Block>

    <hr />

    <Block>
      <Figure sizes={props.data.focus} />
    </Block>
    <Block vc align="right">
      <h3>Refining the frontend</h3>
      <p>
        Analyzing the behaviors of our users over the course of two years, I was
        able to confidently design the next version of localhost, aiming to
        improve both the experience of listing and booking apartments.
      </p>
    </Block>

    <Block vc>
      <h3>Building a system</h3>
      <p>
        Using Storybook for React, I built a living style guide including not
        only colors and brand information, but also the documentation of
        components that are used throughout the application.
      </p>
    </Block>

    <Block vc align="right">
      <Figure link sizes={props.data.styleguide} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageLocalhost {
    logo: file(relativePath: { eq: "localhost/logo.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    landing: file(relativePath: { eq: "localhost/landing.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ui1: file(relativePath: { eq: "localhost/ui1.png" }) {
      childImageSharp {
        sizes(maxWidth: 1300, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ui2: file(relativePath: { eq: "localhost/ui2.png" }) {
      childImageSharp {
        sizes(maxWidth: 1300, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    focus: file(relativePath: { eq: "localhost/focus.png" }) {
      childImageSharp {
        sizes(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    styleguide: file(relativePath: { eq: "localhost/styleguide.png" }) {
      childImageSharp {
        sizes(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
