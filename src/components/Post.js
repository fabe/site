import React from 'react';
import Link from 'gatsby-link';
import HGroup from './HGroup';

export default ({ post }) => (
  <div className="post" key={post.node.data.path}>
    <Link to={post.node.data.path}>
      <div className="cover">
        <h2>{post.node.data.subtitle}</h2>
        <img src={post.node.data.cover} alt={post.node.data.title} />
      </div>
      {/*<HGroup title={post.node.data.title} subtitle={post.node.data.subtitle} />*/}
    </Link>
  </div>
);
