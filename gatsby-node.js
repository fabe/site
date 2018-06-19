const path = require(`path`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var scrape = require('html-metadata');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

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

function getPagination(articles, article) {
  const index = articles.findIndex(
    a => a.node.frontmatter.path == article.node.frontmatter.path
  );

  let nextIndex = index + 1;
  if (nextIndex === articles.length) {
    nextIndex = 0;
  }

  let prevIndex = index - 1;
  if (prevIndex < 0) {
    prevIndex = articles.length - 1;
  }

  const nextArticle = articles[nextIndex];
  const prevArticle = articles[prevIndex];

  return {
    nextArticle,
    prevArticle,
  };
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    // Query for all markdown "nodes" and for the slug we previously created.
    resolve(
      graphql(
        `
          {
            allJavascriptFrontmatter(
              filter: { frontmatter: { path: { regex: "/work/" } } }
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  fileAbsolutePath
                  frontmatter {
                    path
                    subtitle
                    id
                    title
                    details {
                      title
                      description
                    }
                    date
                    excerpt
                    contain
                    background
                    subtitle
                    cover {
                      childImageSharp {
                        fluid(maxWidth: 1100, quality: 90) {
                          ...GatsbyImageSharpFluid_withWebp
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          fragment GatsbyImageSharpFluid_withWebp on ImageSharpFluid {
            base64
            aspectRatio
            src
            srcSet
            srcWebp
            srcSetWebp
            sizes
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          console.log(result);
          reject(result.errors);
        }

        const articles = result.data.allJavascriptFrontmatter.edges;

        articles.forEach(edge => {
          let { frontmatter } = edge.node;
          const pagination = getPagination(articles, edge);

          createPage({
            path: frontmatter.path, // required
            component: path.resolve(edge.node.fileAbsolutePath),
            context: {
              frontmatter,
              ...pagination,
            },
          });
        });

        return;
      })
    );
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-root-import`,
  });
};

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            // fallback to style-loader in development
            process.env.NODE_ENV !== 'production'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'styles.css',
        chunkFilename: '[id].css',
      }),
    ],
  });
};
