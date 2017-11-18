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
      {post.node.data.devOnly ? <div className="dev-only">Dev Only</div> : null}
      {/*<HGroup title={post.node.data.title} subtitle={post.node.data.subtitle} />*/}
    </Link>
  </div>
);
