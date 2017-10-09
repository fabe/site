import React from 'react';

export default ({ children, align }) => (
  <div className={`block ${align}`}>{children}</div>
);
