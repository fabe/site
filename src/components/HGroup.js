import React from 'react';

export default ({ title, subtitle, large }) => (
  <hgroup>
    <h6>{subtitle}</h6>
    {large ? <h1>{title}</h1> : <p>{title}</p>}
  </hgroup>
);
