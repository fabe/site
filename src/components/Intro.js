import React from 'react';

export default ({ children, details }) => (
  <div className="intro">
    <ul>{details.map((item, i) => <li key={i}>{item.description}</li>)}</ul>
  </div>
);
