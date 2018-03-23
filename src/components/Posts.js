import React from 'react';
import Post from './Post';

const split = items => {
  let col1 = [];
  let col2 = [];

  items.map((item, i) => {
    if (i % 2 != 0) {
      col1.push(item);
    } else {
      col2.push(item);
    }
  });

  return (
    <div className="grid">
      <div className="col">{col1}</div>
      <div className="col">{col2}</div>
    </div>
  );
};

const preparePosts = posts => {
  const nodes = posts.map(post => {
    if (post.node.path !== '/404/') {
      return <Post key={post.node.frontmatter.path} post={post} />;
    }
  });

  return split(nodes);
};

export default ({ posts }) => (
  <div id="work" className="posts">
    {preparePosts(posts)}
  </div>
);
