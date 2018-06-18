// Inspired by https://github.com/Vagr9K/gatsby-advanced-starter

import React, { Component } from 'react';
import Helmet from 'react-helmet';

const config = {
  siteTitle: 'Fabian Schultz',
  author: 'Fabian Schultz',
  siteDescription: `Hello, I'm Fabian Schultz — a product designer and developer based in Potsdam, Germany.`,
  siteUrl: 'https://fabianschultz.com',
  userTwitter: 'fschultz_',
};

class SEO extends Component {
  render() {
    const { postNode, postPath, postSEO, pageSEO } = this.props;
    const { siteTitle, siteUrl, siteDescription, userTwitter, author } = config;
    let title;
    let description;
    let image;
    let postURL;

    if (postSEO || pageSEO) {
      const postMeta = postNode;
      title = `${siteTitle} | ${postMeta.subtitle}`;
      description = postMeta.excerpt ? postMeta.excerpt : postNode.title;
      image = postMeta.cover.childImageSharp.fluid.src;
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
      schemaOrgJSONLD.push({
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': `${siteUrl}/work`,
              name: 'Work',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': postURL,
              name: title,
              image,
            },
          },
        ],
      });

      schemaOrgJSONLD.push({
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: postURL,
        name: title,
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: siteTitle,
          logo: {
            '@type': 'ImageObject',
            url: 'https://fabianschultz.com/publisher.jpg',
          },
        },
        datePublished: postNode.date,
        alternateName: '',
        headline: postNode.subtitle,
        image: {
          '@type': 'ImageObject',
          url: image,
        },
        description,
      });
    }

    if (pageSEO) {
      schemaOrgJSONLD.push({
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
      });
    }

    return (
      <Helmet>
        {/* General tags */}
        <meta name="description" content={description} />
        <meta name="image" content={image} />
        <link rel="canonical" href={postSEO ? postURL : siteUrl} />

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
