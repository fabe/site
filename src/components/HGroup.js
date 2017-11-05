import React from 'react';

export default ({ title, subtitle, large }) => (
  <hgroup>
    <h6>{subtitle}</h6>
    {large ? (
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
    ) : (
      <p>{title}</p>
    )}
  </hgroup>
);
