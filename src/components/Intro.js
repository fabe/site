import React from 'react';

export default ({ children, details }) => (
  <div className="intro">
    <div>
      <h6>&nbsp;</h6>
      <p>{children}</p>
    </div>
    <div>
      {details.map((item, i) => (
        <div key={i}>
          <h6>{item.title}</h6>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);
