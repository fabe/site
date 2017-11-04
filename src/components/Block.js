import React from 'react';

export default ({ children, align, pull, vc, full }) => (
  <div
    className={`block ${align ? align : ''} ${pull ? 'pull' : ''} ${vc
      ? 'vc'
      : ''} ${full ? 'full' : ''}`}
  >
    {children}
  </div>
);
