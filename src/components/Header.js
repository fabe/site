import React from 'react';
import Img from 'gatsby-image';

import hero from '~/static/covers/hero-bw.jpg';
import location from '~/static/icons/location.svg';

class Header extends React.Component {
  constructor() {
    super();

    this.windowHeight = 0;
  }

  render() {
    const { children, cover, video, title, contain, background } = this.props;

    return (
      <header className="header grid">
        <div className="col">
          <div className="figure">
            {cover && !video ? (
              <Img sizes={cover.childImageSharp.sizes} />
            ) : null}
            {!cover && !video ? <img src={hero} alt={title} /> : null}
            {!cover && video ? <video autoPlay loop src={video} /> : null}
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
