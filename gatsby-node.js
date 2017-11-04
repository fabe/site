const path = require('path');

// exports.createPages = ({ boundActionCreators, graphql }) => {
//   const { createPage } = boundActionCreators;

//   const blogPostTemplate = path.resolve(`src/templates/Article.js`);

//   return graphql(`{
//         allJsFrontmatter(filter: { data: { isWork: { eq: true } } }) {
//             edges {
//               node {
//                 id
//                 data {
//                   fullPath
//                   path
//                   date
//                   title
//                   category
//                 }
//               }
//             }
//           }
//         }`).then(result => {
//     if (result.errors) {
//       return Promise.reject(result.errors);
//     }

//     result.data.allJsFrontmatter.edges.forEach(({ node }) => {
//       createPage({
//         path: node.data.path,
//         context: { jesus: 'christ' }, // additional data can be passed via context
//       });
//     });
//   });
// };

exports.onCreatePage = ({ page, boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  console.log(boundActionCreators);

  return new Promise((resolve, reject) => {
    if (page.path.match(/^\/work/)) {
      // It's assumed that `landingPage.js` exists in the `/layouts/` directory
      // page.component = path.resolve(`src/components/Test.js`);
      page.context = { jesus: 'christ' };

      // const test = graphql(`
      //   {
      //     allJsFrontmatter(filter: { data: { isWork: { eq: true } } }) {
      //       edges {
      //         node {
      //           id
      //           data {
      //             fullPath
      //             path
      //             date
      //             title
      //             category
      //           }
      //         }
      //       }
      //     }
      //   }
      // `).then(result => {
      //   if (result.errors) {
      //     return Promise.reject(result.errors);
      //   }

      //   console.log(result);
      // });

      // Update the page.
      createPage(page);
    }

    resolve();
  });
};
