// Inspired by https://github.com/Vagr9K/gatsby-advanced-starter

import React, { Component } from 'react';
import Helmet from 'react-helmet';

const config = {
  siteTitle: 'Fabian W. Schultz',
  siteDescription: `Hello, I'm Fabian — a product designer and developer based in Potsdam, Germany. I’ve been working both as a product designer and frontend developer for over 5 years now. I particularly enjoy working with companies that try to meet broad and unique user needs. Currently, I study Interface Design at the University of Applied Sciences in Potsdam, Germany.`,
  siteUrl: 'https://fabianschultz.com',
  pathPrefix: '/work',
  userTwitter: 'fschultz_',
};

class SEO extends Component {
  render() {
    const { postNode, postPath, postSEO } = this.props;
    const { siteTitle, siteUrl, siteDescription, userTwitter } = config;
    let title;
    let description;
    let image;
    let postURL;

    if (postSEO) {
      console.log(postNode);
      const postMeta = postNode;
      title = `${siteTitle} | ${postMeta.subtitle}`;
      description = postMeta.excerpt ? postMeta.excerpt : postNode.title;
      image = postMeta.cover.childImageSharp.sizes.src;
      postURL = siteUrl + postPath;
    } else {
      title = siteTitle;
      description = siteDescription;
      image = '/covers/hero-bw.jpg';
    }
    image = siteUrl + image;

    const schemaOrgJSONLD = [
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        url: siteUrl,
        name: title,
        alternateName: '',
      },
    ];
    if (postSEO) {
      schemaOrgJSONLD.push([
        {
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': postURL,
                name: title,
                image,
              },
            },
          ],
        },
        {
          '@context': 'http://schema.org',
          '@type': 'BlogPosting',
          url: siteUrl,
          name: title,
          alternateName: '',
          headline: title,
          image: {
            '@type': 'ImageObject',
            url: image,
          },
          description,
        },
      ]);
    }
    return (
      <Helmet>
        {/* General tags */}
        <meta name="description" content={description} />
        <meta name="image" content={image} />

        {/* Schema.org tags */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>

        {/* OpenGraph tags */}
        <meta property="og:url" content={postSEO ? postURL : siteUrl} />
        {postSEO ? <meta property="og:type" content="article" /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={userTwitter ? userTwitter : ''} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    );
  }
}

export default SEO;
