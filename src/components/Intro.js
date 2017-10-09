import React from 'react';

export default ({ children, details }) => (
  <div className="intro">
    <div>
      <p>{children}</p>
    </div>
    <div>
      {details.map(item => (
        <div>
          <h6>{item.title}</h6>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);
