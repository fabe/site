import React from 'react';

export default ({ children, details }) => (
  <div className="intro">
    <ul>
      {details ? (
        details.map((item, i) => <li key={i}>{item.description}</li>)
      ) : null}
    </ul>
  </div>
);
