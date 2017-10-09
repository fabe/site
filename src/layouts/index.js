import React from 'react';
import Link from 'gatsby-link';

import Footer from '../components/Footer';

import './index.css';

class Template extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollTop: 0,
    };
    this.bar = {};
    this.handleScroll = this.handleScroll.bind(this);
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
          <div className="container">
            <span>
              <Link to="/">Fabian W. Schultz</Link>
            </span>
            <nav>
              <ul>
                <li>
                  <Link to="/#work" exact activeClassName="active">
                    Work
                  </Link>
                </li>
                <li>
                  <Link to="/about" activeClassName="active">
                    About
                  </Link>
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
          </div>
        </div>
        {children()}
        <Footer />
      </div>
    );
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
};

export default Template;
