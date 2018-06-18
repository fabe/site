import React from 'react';
import Img from 'gatsby-image';

import hero from '~/static/covers/hero-bw.jpg';

class Header extends React.Component {
  constructor() {
    super();

    this.windowHeight = 0;
    this.state = { loaded: false };
  }

  componentDidMount() {
    this.setState({ loaded: true });
  }

  renderNoScript() {
    return (
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .title,
              .summary,
              .intro {
                opacity: 1 !important;
              }
        `,
          }}
        />
      </noscript>
    );
  }

  renderHero(cover, renderCover, video, title) {
    if (renderCover) {
      return renderCover();
    }

    if (cover && !video) {
      return <Img fluid={cover.childImageSharp.fluid} />;
    }

    if (!cover && !video) {
      return <img src={hero} alt={title} />;
    }

    if (!cover && video) {
      return <video autoPlay loop src={video} />;
    }
  }

  render() {
    const { children, cover, renderCover, video, title, simple } = this.props;
    const { loaded } = this.state;

    if (!simple) {
      return (
        <header className={`header grid${loaded ? ' loaded' : ''}`}>
          <div className="col">
            <div className="figure">
              {this.renderHero(cover, renderCover, video, title)}
            </div>
          </div>
          <div className="col">
            <div className="meta">{children}</div>
          </div>
          {this.renderNoScript()}
        </header>
      );
    } else {
      return (
        <header className="header grid">
          <div>{children}</div>
          {this.renderNoScript()}
        </header>
      );
    }
  }
}

export default Header;
