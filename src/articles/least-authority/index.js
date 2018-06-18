import React from 'react';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const frontmatter = {
  id: 'leastauthority',
  isWork: true,
  title: 'New website for the<br/>privacy–focused startup Least Authority',
  subtitle: 'Least Authority',
  date: '2017-02-01',
  cover: './least-authority.png',
  path: '/work/least-authority',
  contain: true,
  background: '#333',
  excerpt: `Late 2016 I was asked to design and develop a website for the Zcash Open Source Miner Challenge, which was operated by Least Authority. After the launch, I helped Least Authority redesign their own website, taking care of both development and design.`,
  details: [
    {
      title: 'Responsibility',
      description: 'Design & Development',
    },
    {
      title: 'Date',
      description: 'Q1 2017',
    },
    {
      title: 'Technology',
      description: 'Static Site, LektorCMS',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        Late 2016 I was asked to design and develop a website for the{' '}
        <a href="https://zcashminers.org/">Zcash Open Source Miner Challenge</a>,
        which was operated by Least Authority. After the launch, I helped Least
        Authority redesign their own website, taking care of both development
        and design.
      </p>
    </Block>
    <Block align="right">
      <p>
        Least Authority is building an affordable, ethical, usable, and lasting
        data storage solution. Their focus lies heavy on open source software,
        transparency and end-to-end cryptography. They offer a verifiably secure
        off-site backup system for individuals and businesses.
      </p>
    </Block>
    <hr />
    <Block>
      <Figure background fluid={props.data.variables} />
    </Block>
    <Block align="right" vc>
      <h3>Visual Exploration</h3>
      <p>
        As the branding already existed, I only made small tweaks to the visual
        appearance of the company. After researching about Least Authority and
        its products, I decided to go with <em>DIN Next Pro</em> as a typeface.
        A strong red was used as the accent color, together with several shades
        of grey.
      </p>
    </Block>

    <Block full align="center" pull>
      <h2>Landing Page</h2>
      <p>Featuring an animated terminal to demo their&nbsp;product.</p>
    </Block>
    <Block full>
      <Figure background frame fluid={props.data.landing} />
    </Block>

    <Block full align="center" pull>
      <h2>Infographic</h2>
      <p>
        To explain their service better, I designed an infographic highlighting
        security features of Least&nbsp;Authority's S4.
      </p>
    </Block>
    <Block full>
      <Figure background fluid={props.data.infographic} />
    </Block>

    <Block full align="center" pull>
      <h2>Products</h2>
      <p>Comparing Least Authority's&nbsp;products.</p>
    </Block>
    <Block full>
      <Figure background frame fluid={props.data.products} />
    </Block>

    <Block vc>
      <h3>Technology</h3>
      <p>
        The website was coded on top of the static content management system{' '}
        <a href="https://www.getlektor.com/">Lektor</a>, to provide a familiar
        Python <span className="caps">API</span> for Least Authority’s
        developers. It is fully customizable through an admin panel, changes are
        pushed continuously through their GitHub repository.
      </p>
    </Block>
    <Block align="right">
      <Figure background fluid={props.data.cms} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageLA {
    variables: file(relativePath: { eq: "least-authority/variables.png" }) {
      childImageSharp {
        fluid(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    infographic: file(relativePath: { eq: "least-authority/infographic.png" }) {
      childImageSharp {
        fluid(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    landing: file(relativePath: { eq: "least-authority/landing.png" }) {
      childImageSharp {
        fluid(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    products: file(relativePath: { eq: "least-authority/products.png" }) {
      childImageSharp {
        fluid(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    cms: file(relativePath: { eq: "least-authority/cms.png" }) {
      childImageSharp {
        fluid(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
