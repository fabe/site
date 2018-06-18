import React from 'react';
import { StaticQuery } from 'gatsby';

import '~/src/styles/style.scss';

import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default ({ children, location }) => (
  <StaticQuery
    query={graphql`
      query TemplateQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Topbar title={data.site.siteMetadata.title} />
        <main className="container">{children}</main>
        <Footer title={data.site.siteMetadata.title} />
      </>
    )}
  />
);
