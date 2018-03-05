import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import TweetEmbed from 'react-tweet-embed';

import Article from '~/src/components/Article';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import homepageMp4 from './homepage.mp4';
import homepageWebm from './homepage.webm';

export const data = {
  id: 'momenta',
  isWork: true,
  title: 'Capture your moments as pictures with sound.',
  subtitle: 'Momenta',
  date: '2013-12-31',
  path: '/work/momenta',
  contain: false,
  background: '#6B476B',
  excerpt: `During my internship at Door2Door in Berlin, I joined Alex, Jose and Kirsty as a co-founder of Momenta. My focus was on all things web, allowing me to work on both the design and development of the product.`,
  details: [
    {
      title: 'Responsibility',
      description: 'Co-Founder, Design & Development',
    },
    {
      title: 'Date',
      description: '2013 – 2014',
    },
  ],
};

export default props => (
  <Article path={data.path} {...props}>
    <Block mobilePull>
      <p>
        During my internship at{' '}
        <a href="https://www.door2door.io/">Door2Door</a> in Berlin, I joined{' '}
        <a href="https://twitter.com/herrhaase">Alex</a>,{' '}
        <a href="https://twitter.com/Jl_Ugia">Jose</a> and{' '}
        <a href="https://twitter.com/kirstyllee">Kirsty</a> as a co-founder of
        Momenta. My focus was on all things web, allowing me to work on both the
        design and development of the product.
      </p>
    </Block>

    <Block align="right">
      <p>
        <a href="http://www.momenta.io/">Momenta</a> is a simple yet beautiful
        way to capture and remember life’s special moments. Through the powerful
        combination of pictures and sound, it allows you to share a special
        moment of your life with the people you care about.
      </p>
    </Block>

    <hr />

    <Block align="center" pull>
      <h2>Landing Page</h2>
      <p>
        Previously to the launch of the iPhone App, I designed and coded the{' '}
        <a href="http://www.momenta.io/">landing page</a> for&nbsp;Momenta.
      </p>
    </Block>

    <Block align="center">
      <Figure video mp4={homepageMp4} webm={homepageWebm} background />
    </Block>

    <Block align="center" pull>
      <h2>Momenta for the Web</h2>
      <p>
        Sharing and embedding{' '}
        <a href="http://www.momenta.io/m/Hfyb0pHLXt1wlVBSepvZ">moments</a>{' '}
        outside of the&nbsp;App.
      </p>
    </Block>

    <Block align="center">
      <Figure sizes={props.data.share} background />
    </Block>

    <Block vc>
      <p>
        Apple ended up adding a similar feature to iOS in September 2015:{' '}
        <a href="http://tcrn.ch/1Mc1L7u">Live Photos</a>. It was &mdash;
        together with our growing user-base &mdash; a welcome validation of our
        concept.
      </p>
    </Block>

    <Block align="right">
      <TweetEmbed id="641689604815462400" align="center" />
    </Block>

    <hr />

    <Block>
      <Figure sizes={props.data.sunset} />
    </Block>

    <Block align="right" vc>
      <h3>Goodbye</h3>
      <p>
        We eventually sunsetted Momenta to move on to other projects.
        Nonetheless I’ve learned a tremendous amount about community building
        and working remotely in a team.
      </p>
      <p>
        Being 17 years old at the time, I was able to gain a huge amount of
        insight from my teammates on designing products, building them, and
        eventually exposing them to the real world.
      </p>
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageMomenta {
    sunset: file(relativePath: { eq: "work/momenta/sunset.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    share: file(relativePath: { eq: "work/momenta/share.png" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
