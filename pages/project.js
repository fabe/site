import React from 'react';
import Page from '~/components/page';

export default props => {
  let pageJson = {};
  pageJson = require(`../content/${props.url.query.id}.json`);

  return (
    <div>
      {Body(pageJson)}
    </div>
  );
};

function Body(props) {
  return (
    <Page>
      <h1>
        {props.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: props.bodyHtml }} />
    </Page>
  );
}
