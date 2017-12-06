import React from 'react';

export default ({ children, align, pull, vc, full, style, mobilePull }) => (
  <div
    style={style}
    className={`block ${align ? align : ''} ${pull ? 'pull' : ''} ${vc
      ? 'vc'
      : ''} ${full ? 'full' : ''} ${mobilePull ? 'mobile-pull' : ''}`}
  >
    {children}
  </div>
);
