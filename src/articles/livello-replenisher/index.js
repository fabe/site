import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import video_1 from './video-1.mp4';
import video_2 from './video-2.mp4';

export const frontmatter = {
  id: 'livello-replenisher',
  isWork: true,
  subtitle: 'Livello Replenisher',
  title: 'Building a fleet management app for smart fridges',
  date: '2019-01-01',
  cover: './livello-replenisher.png',
  path: '/work/livello-replenisher',
  excerpt: ``,
  details: [
    {
      title: 'Responsibility',
      description: 'UX/UI & Native Development',
    },
    {
      title: 'Date',
      description: 'Q1 2019',
    },
    {
      title: 'Technology',
      description: 'Sketch, React, React Native, Expo',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        In January 2019 I helped out my friends at Livello again, this time to
        work on their fleet management app, which is used by their workforce to
        replenish their smart fridges on location.
      </p>
      <p>
        Livello is a Food-Tech IoT startup that provides smart fridges to
        companies and universities. Fridges can be opened by your smartphone and
        the products inside are recognized by RFID readers and load cells.
      </p>
    </Block>
    <Block align="right">
      <p>
        I was brought in to design and develop the replenisher app around a
        complex process that involves several parties—such as drivers, managers,
        and admins.
      </p>
      <p>
        Designing between the poles of a simple replenishment flow and a
        straightforward technological implementation was of importance. After
        designing the app in close contact with the Livello team, I developed it
        using React Native (+Expo).
      </p>
    </Block>

    <Block align="left" pull>
      <Figure
        sizes={props.data.ui_1}
        caption="Two recurring visual elements. Floating buttons are used for currently available actions."
      />
    </Block>

    <Block align="right" pull>
      <Figure
        sizes={props.data.ui_2}
        caption="A core feature of the app: getting crucial real-time information of a fridge with one glance."
      />
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>Scanning Products</h2>
      <p>
        To add the physical products to the database, the replenisher has to
        scan the RFID-Tags of each product batch using the phone’s camera.
      </p>
    </Block>
    <Block align="center" pull>
      <div className="phone-framer">
        <video autoPlay loop src={video_1} playsInline muted />
        <Figure sizes={props.data.frame_1} />
      </div>
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>On Location</h2>
      <p>When the replenisher arrives</p>
    </Block>
    <Block align="center" pull>
      <div className="phone-framer">
        <video autoPlay loop src={video_2} playsInline muted />
        <Figure sizes={props.data.frame_2} />
      </div>
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>One codebase, two platforms</h2>
      <p>
        The app was designed initially for Android, the styles for iOS were
        designed entirely in code.
      </p>
    </Block>
    <Block align="center" pull>
      <Figure sizes={props.data.ui_3} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageLivelloReplenisher {
    ui_1: file(relativePath: { eq: "livello-replenisher/ui-1.png" }) {
      childImageSharp {
        sizes(maxWidth: 522, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ui_2: file(relativePath: { eq: "livello-replenisher/ui-2.png" }) {
      childImageSharp {
        sizes(maxWidth: 522, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ui_3: file(relativePath: { eq: "livello-replenisher/ui-3.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    frame_1: file(relativePath: { eq: "livello-replenisher/frame-1.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    frame_2: file(relativePath: { eq: "livello-replenisher/frame-2.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
