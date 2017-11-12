var scrape = require('html-metadata');

exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    if (page.path === '/side-projects/') {
      const url =
        'https://chrome.google.com/webstore/detail/npr-player/pflcdcelbkdhfjglfpgiodfknhpdcmjl';

      scrape(url).then(function(metadata) {
        const nprUsers = metadata.schemaOrg.items[0].properties.interactionCount[0].split(
          ':'
        )[1];
        page.context = {
          nprUsers,
        };
        createPage(page);
      });
    } else {
      createPage(page);
    }

    resolve();
  });
};
