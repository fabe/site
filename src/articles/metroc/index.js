import React from 'react';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const frontmatter = {
  id: 'metroc',
  isWork: true,
  devOnly: true,
  title: 'Developing the website for a Toronto-based college',
  subtitle: 'Metro College of Technology',
  date: '2016-08-01',
  cover: './metroc.png',
  path: '/work/metroc',
  contain: true,
  background: '#26272C',
  excerpt: `In Mid 2016 I was asked to develop their new website (designed by Victoria Leontieva) and help them scale their online enrollment business. Required by the client was a swift transition from their old website, while using the same Wordpress–powered stack.`,
  details: [
    {
      title: 'Responsibility',
      description: 'Frontend Development, CMS',
    },
    {
      title: 'Responsibility',
      description: 'Wordpress, Responsive',
    },
    {
      title: 'Date',
      description: 'Mid 2016',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        Metro College of Technology is a career college, founded in 1992 and
        located in the dynamic city of Toronto, Ontario. Their mission is to
        prepare students for today’s competitive job market and develop their
        long-term career perspectives. (Source:{' '}
        <a href="http://metroc.ca/about-us">metroc.ca</a>)
      </p>
    </Block>
    <Block align="right">
      <p>
        In Mid 2016 I was asked to develop their new website (designed by{' '}
        <a href="http://killnicole.github.io/">Victoria Leontieva</a>) and help
        them scale their online enrollment business. Required by the client was
        a swift transition from their old website, while using the same
        Wordpress–powered stack.
      </p>
    </Block>
    <hr />
    <Block pull>
      <h2>See it live</h2>
    </Block>
    <Block align="right" pull>
      <a href="http://metroc.ca" className="button">
        Visit metroc.ca
      </a>
    </Block>
    <Block align="center">
      <Figure background fluid={props.data.screens} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageMetro {
    screens: file(relativePath: { eq: "metroc/screens.png" }) {
      childImageSharp {
        fluid(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
