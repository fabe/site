import React from 'react';
import PropTypes from 'prop-types';

import '~/src/styles/style.scss';

import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

class Template extends React.Component {
  render() {
    const { location, children } = this.props;

    return (
      <div>
        <Topbar />
        <main className="container">
        {children()}
        </main>
        <Footer />
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
