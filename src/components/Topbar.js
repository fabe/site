import React from 'react';
import Link from 'gatsby-link';

class Topbar extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollTop: 0,
      offsetTop: 80,
      showMenu: false,
    };

    this.topbar = {};
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
    this.setState({ offsetTop: this.topbar.offsetTop });
  }

  handleMenuToggle() {
    if (window.innerWidth <= 480) {
      this.setState({ showMenu: !this.state.showMenu });
    }
  }

  render() {
    const { scrollTop } = this.state;

    return (
      <div
        ref={topbar => (this.topbar = topbar)}
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
    );
  }
}

export default Topbar;
