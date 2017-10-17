import React from 'react';

import hero from '~/static/covers/webp/default.webp';
import location from './icons/location.svg';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      height: '',
    };
    this.windowHeight = 0;
    this.calculateViewportHeight = this.calculateViewportHeight.bind(this);
  }
  componentDidMount() {
    this.windowHeight = window.innerHeight;
    this.calculateViewportHeight();
    window.addEventListener('resize', this.calculateViewportHeight);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateViewportHeight);
  }
  calculateViewportHeight() {
    if (this.windowHeight === window.innerHeight) {
      if (window.innerWidth < 480) {
        this.setState({
          height: window.innerHeight,
        });
      } else {
        this.setState({
          height: '',
        });
      }
    }

    this.windowHeight = window.innerHeight;
  }
  render() {
    const {
      readOn,
      children,
      isLocation,
      scrollTop,
      cover,
      slim,
      dark,
      video,
      external,
    } = this.props;

    return (
      <header className={`${slim && 'slim'} ${dark && 'dark'}`}>
        <div className="meta container" style={{ height: this.state.height }}>
          <hgroup>{children}</hgroup>
          <span>
            {isLocation == 'jesus' ? <img src={location} alt="" /> : null}
            {readOn && (
              <a className="button secondary" href="#content">
                Read on
              </a>
            )}
            {external ? (
              <a href={external} className="button">
                Visit website
              </a>
            ) : null}
          </span>
        </div>
        <div className="bg-box" style={{ height: this.state.height }}>
          {!video ? (
            <div
              className="bg"
              style={{ backgroundImage: `url(${cover || hero})` }}
            />
          ) : (
            <video src={video} autoPlay loop />
          )}
        </div>
      </header>
    );
  }
}

export default Header;
