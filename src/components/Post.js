import React from 'react';
import Link from 'gatsby-link';

export default ({ post }) => (
  <div className="post" key={post.node.data.path}>
    <Link to={post.node.data.path}>
      <div className="cover">
        <img src={post.node.data.cover} alt={post.node.data.title} />
      </div>
      <h6>{post.node.data.subtitle}</h6>
      <h3>{post.node.data.title}</h3>
    </Link>
  </div>
);
