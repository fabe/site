import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import '~/src/styles/style.scss';

import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

class Template extends React.Component {
  render() {
    const { location, children, data } = this.props;

    return (
      <div>
        <Topbar title={data.site.siteMetadata.title} />
        <main className="container">{children()}</main>
        <Footer title={data.site.siteMetadata.title} />
      </div>
    );
  }
}

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
  data: PropTypes.object,
};

export default Template;

export const pageQuery = graphql`
  query TemplateQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
