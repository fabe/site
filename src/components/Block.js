import React from 'react';

export default ({ children, align, pull }) => (
  <div className={`block ${align} ${pull && 'pull'}`}>{children}</div>
);
