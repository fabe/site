import React from 'react';

import hero from '~/static/covers/webp/hero-bw.webp';
import location from '~/static/icons/location.svg';

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
    const { children, cover, video, title, contain, background } = this.props;

    return (
      <header className="grid">
        <div className="col">
          <div className="figure">
            {!video ? (
              <div
                className="img"
                style={{
                  backgroundImage: `url(${cover || hero})`,
                  backgroundSize: contain ? 'contain' : 'cover',
                  backgroundColor: background,
                }}
              />
            ) : (
              <video src={video} autoPlay loop />
            )}
          </div>
        </div>
        <div className="col">
          <div className="meta">{children}</div>
        </div>
      </header>
    );
  }
}

export default Header;
