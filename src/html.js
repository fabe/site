import React from 'react';
import favicon16 from '~/static/icons/favicon-16x16.png';
import favicon32 from '~/static/icons/favicon-32x32.png';

let stylesStr;
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`);
  } catch (e) {
    console.log(e);
  }
}

module.exports = class HTML extends React.Component {
  render() {
    let css;
    if (process.env.NODE_ENV === `production`) {
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{ __html: stylesStr }}
        />
      );
    }
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="icon" type="image/png" href={favicon32} sizes="32x32" />
          <link rel="icon" type="image/png" href={favicon16} sizes="16x16" />
          <meta
            property="og:description"
            content="Hello, I'm Fabian — a product designer and developer based in Potsdam, Germany."
          />
          <meta
            property="og:image:url"
            content="https://fabianschultz.com/static/thumbnail.jpg"
          />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:url" content="https://fabianschultz.com" />
          <meta property="og:title" content="Fabian W. Schultz" />
          <meta name="theme-color" content="#13ba6c" />
          <script src="/vendor/webfont.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                WebFont.load({
                  custom: {
                    families: ['Nitti Grotesk'],
                  },
                });
          `,
            }}
          />
          {this.props.headComponents}
          {css}
        </head>
        <body>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
};
