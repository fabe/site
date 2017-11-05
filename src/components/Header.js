import React from 'react';
import Img from 'gatsby-image';

import hero from '~/static/covers/webp/hero-bw.webp';
import location from '~/static/icons/location.svg';

class Header extends React.Component {
  constructor() {
    super();

    this.windowHeight = 0;
  }

  render() {
    const { children, cover, video, title, contain, background } = this.props;
    console.log(this.props);

    return (
      <header className="grid">
        <div className="col">
          <div className="figure">
            {cover ? (
              <Img sizes={cover.childImageSharp.sizes} />
            ) : (
              <img src={hero} alt={title} />
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

