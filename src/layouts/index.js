import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

import Footer from '../components/Footer';

import '~/src/styles/style.scss';
import favicon16 from '~/static/favicon-16x16.png';
import favicon32 from '~/static/favicon-32x32.png';

class Template extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollTop: 0,
      offsetTop: 80,
      showMenu: false,
    };

    this.bar = {};
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  componentDidMount() {
    this.handleScroll();
    this.handleResize();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleScroll() {
    this.setState({ scrollTop: window.scrollY });
  }

  handleResize() {
    this.setState({ offsetTop: this.bar.offsetTop });
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
    console.log(this.bar.offsetHeight);

    return (
      <div>
        <Helmet>
          <link rel="icon" type="image/png" href={favicon32} sizes="32x32" />
          <link
            rel="icon"
            type="image/png"
            href="/static/favicon-16x16.png"
            sizes={favicon16}
          />
          <meta
            property="og:description"
            content="Hello, I'm Fabian — a product designer and developer based in Potsdam, Germany."
          />
          <meta
            property="og:image:url"
            content="https://fabianschultz.com/static/thumbnail.jpg"
          />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:url" content="https://fabianschultz.com" />
          <meta property="og:title" content="Fabian W. Schultz" />
        </Helmet>
        <div
          ref={bar => (this.bar = bar)}
          className={`topbar ${scrollTop > this.state.offsetTop
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
