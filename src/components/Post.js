import React from 'react';
import Link from 'gatsby-link';
import Img from 'gatsby-image';
import HGroup from './HGroup';

export default ({ post }) => (
  <div className="post" key={post.node.data.path}>
    <Link to={post.node.data.path}>
      <div className="cover">
        <h2>{post.node.data.subtitle}</h2>
        <Img sizes={post.node.data.cover.childImageSharp.sizes} />
      </div>
      {/*<HGroup title={post.node.data.title} subtitle={post.node.data.subtitle} />*/}
    </Link>
  </div>
);
