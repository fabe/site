import React from 'react';

export default ({ children, align, pull, vc }) => (
  <div
    className={`block ${align ? align : ''} ${pull ? 'pull' : ''} ${vc
      ? 'vc'
      : ''}`}
  >
    {children}
  </div>
);
