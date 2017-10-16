import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import Footer from '../components/Footer';

import '~/src/styles/style.scss';

class Template extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollTop: 0,
      showMenu: false,
    };
    this.bar = {};
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }
  componentDidMount() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll() {
    this.setState({ scrollTop: window.scrollY });
  }
  handleMenuToggle() {
    if (window.innerWidth <= 480) {
      this.setState({ showMenu: !this.state.showMenu });
    }
  }
  render() {
    const { location, children } = this.props;
    const { scrollTop } = this.state;
    let header;
    return (
      <div>
        <div
          ref={bar => (this.bar = bar)}
          className={`topbar ${scrollTop > this.bar.offsetHeight
            ? 'scrolled'
            : ''}`}
        >
          <div className={`container${this.state.showMenu ? ' showMenu' : ''}`}>
            <span className="name">
              <Link to="/">Fabian W. Schultz</Link>
            </span>
            <nav onClick={this.handleMenuToggle}>
              <ul>
                <li>
                  <Link to="/#work">Work</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <a
                    className="external"
                    href="mailto:desk@fabianschultz.com?subject=Inquiry"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <div className="menuicon" onClick={this.handleMenuToggle}>
              <span className="top" />
              <span className="bottom" />
            </div>
          </div>
        </div>
        {children()}
        <Footer />
      </div>
    );
  }
}

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
};

export default Template;
