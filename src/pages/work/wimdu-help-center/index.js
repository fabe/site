import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const data = {
  id: 'wimdu',
  isWork: true,
  title: 'Building a support center for Wimdu’s 2.5MM users.',
  subtitle: 'Wimdu Help Center',
  date: '2015-06-01',
  path: '/work/wimdu-help-center',
  excerpt: `In Mid 2015 I was asked to design and develop a new support center for Wimdu and help them bring their recenly redesigned brand to all channels of communication. I worked closely with their team as a contractor and launched the site on top of their existing support system, Zendesk.`,
  details: [
    {
      title: 'Responsibility',
      description: 'UI Design, Frontend Development, CMS',
    },
    {
      title: 'Platform',
      description: 'Zendesk',
    },
    {
      title: 'Date',
      description: 'Mid 2015',
    },
  ],
};

export default props => (
  <Article path={data.path} {...props}>
    <Block mobilePull>
      <p>
        Wimdu is one of the world’s leading online marketplaces for private
        accommodation. They believe passionately in the power of travel and
        strive each day to make quality travel experiences more accessible to
        everyone. With over 350,000 properties in more than 150 countries, Wimdu
        offers travellers authentic and affordable accommodation (Source:{' '}
        <a href="https://www.wimdu.com/aboutus#about-us-about-us">wimdu.com</a>)
      </p>
    </Block>
    <Block align="right">
      <p>
        In Mid 2015 I was asked to design and develop a new support center for
        Wimdu and help them bring their recenly redesigned brand to all channels
        of communication. I worked closely with their team as a contractor and
        launched the site on top of their existing support system,&nbsp;Zendesk.
      </p>
    </Block>
    <hr />
    <Block pull>
      <h2>See it live</h2>
    </Block>
    <Block align="right" pull>
      <a href="https://www.wimdu.com/contact_requests/new" className="button">
        Visit wimdu.com
      </a>
    </Block>
    <Block align="center">
      <Figure background sizes={props.data.screens} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageWimdu {
    screens: file(relativePath: { eq: "work/wimdu-help-center/screens.png" }) {
      childImageSharp {
        sizes(maxWidth: 700, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
