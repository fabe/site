import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const frontmatter = {
  id: 'livello',
  isWork: false,
  subtitle: 'Livello MVP',
  title: 'Building an MVP for a Food-Tech IoT Startup',
  date: '2018-03-01',
  cover: './livello.png',
  path: '/work/livello',
  excerpt: `In February 2018 I was approached by Jose, whom I've been working with on a number of projects in the past. He has been working with a starup called Livello, which produces and maintains smart fridges/vending machines for office spaces and university campuses.`,
  details: [
    {
      title: 'Responsibility',
      description: 'UI Design & Frontend Development',
    },
    {
      title: 'Date',
      description: 'Q1 2018',
    },
    {
      title: 'Technology',
      description: 'React, React Native, Expo',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        In February 2018, I joined a start-up called Livello for a limited time
        as a contractor. Livello produces and maintains smart fridges/vending
        machines.
      </p>
      <p>
        They are set up inside office spaces or college campuses, and allow
        painless purchasing of healthy snacks, meals and drinks.
      </p>
    </Block>
    <Block align="right">
      <p>
        I was brought in to design and develop an MVP for an upcoming pitch
        presentation. Within one month, I designed and developed an interface
        for fridge management and a React Native app.
      </p>
      <p>
        I collaborated with Jose (Backend + Frontend), Pedro (Hardware +
        Firmware), Nelson (Hardware + Firmware) and the Livello team.
      </p>
    </Block>

    <hr />

    <Block align="center" pull>
      <h2>Fleet Management</h2>
      <p>
        I designed and built a dashboard for Livello employees. It allows
        managing fridges and products from one central place.
      </p>
    </Block>

    <Block align="center">
      <Figure sizes={props.data.dashboard} />
    </Block>

    <Block>
      <Figure sizes={props.data.dashboardDetail} />
    </Block>
    <Block vc align="right">
      <h3>Ready for handoff</h3>
      <p>
        Building the web frontend was especially focused on easy extendability.
        An agnostic approach was crucial in both design and development.
      </p>
    </Block>

    <Block vc>
      <h3>Full PWA</h3>
      <p>
        The web frontend is a full Progressive Web App experience. It achieves a
        Lighthouse score above 90 and can be used on any device.
      </p>
    </Block>

    <Block vc align="right">
      <Figure link sizes={props.data.dashboardMobile} />
    </Block>

    <hr />

    <Block align="center">
      <h2>Consumer MVP</h2>
      <p>React Native app built with Expo.</p>
    </Block>

    <Block align="center" pull>
      <Figure sizes={props.data.consumer} />
    </Block>

    <Block align="left" pull>
      <p>
        We developed a consumer mobile application that enables Livello
        customers make purchases right from their phone. Open the fridge, take
        what you want, and close the door. That's it!
      </p>
    </Block>

    <Block align="right" pull>
      <p>
        Customers can set up their payment methods and get an overview of their
        transactions. Opening a fridge to start shopping is only one tap away.
      </p>
    </Block>

    <hr />

    <Block>
      <h3>Technology</h3>
      <p>
        Luckily for us, we were able to use the same tech stack across the
        platforms and applications. React (+Native) handles the UI,
        styled-components manages styling across platforms, and MobX takes care
        of the application state.
      </p>
    </Block>

    <Block align="right">
      <h3>&nbsp;</h3>
      <p>
        Given these circumstances, we were able to come up with working
        prototypes within a very limited timeframe. Additionally, the interfaces
        work across all major platforms: Web, Android and iOS.
      </p>
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageLivello {
    dashboard: file(relativePath: { eq: "livello/dashboard.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    dashboardDetail: file(
      relativePath: { eq: "livello/dashboard-detail.png" }
    ) {
      childImageSharp {
        sizes(maxWidth: 500, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    dashboardMobile: file(
      relativePath: { eq: "livello/dashboard-mobile.png" }
    ) {
      childImageSharp {
        sizes(maxWidth: 500, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    consumer: file(relativePath: { eq: "livello/consumer.png" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 100) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
