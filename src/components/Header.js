import React from 'react';

import hero from './hero-v.jpg';
import location from './icons/location.svg';

export default ({
  readOn,
  children,
  isLocation,
  scrollTop,
  caption,
  cover,
  slim,
  dark,
}) => (
  <header className={`${slim && 'slim'} ${dark && 'dark'}`}>
    <div className="meta container">
      <hgroup>
        {children}
        {readOn && (
          <a className="link read-on" href="#content">
            Read on
          </a>
        )}
      </hgroup>
      <span>
        {isLocation == 'jesus' ? <img src={location} alt="" /> : null}
        {caption}
      </span>
    </div>

    <div className="bg-box">
      <div
        className="bg"
        style={{ backgroundImage: `url(${cover || hero})` }}
      />
    </div>
  </header>
);
