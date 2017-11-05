import React from 'react';
import Img from 'gatsby-image';

export default ({
  src,
  name,
  caption,
  fullWidth,
  background,
  link,
  captionLeft,
  align,
  slim,
  video,
  mp4,
  webm,
  marginTop,
  marginBottom,
  sizes,
}) => (
  <figure
    className={`
      ${background ? 'background' : ''}
      ${slim ? 'slim' : ''} 
      ${marginTop ? 'mt' : ''} 
      ${marginBottom ? 'mb' : ''} 
      ${align}`}
  >
    {!video && !sizes ? (
      <img
        src={src}
        alt={name || caption}
        style={{ maxWidth: fullWidth && '100%' }}
      />
    ) : null}
    {video && !sizes ? (
      <video preload="true" autoPlay loop muted>
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    ) : null}
    {sizes && !video ? <Img sizes={sizes.childImageSharp.sizes} /> : null}
    <figcaption style={{ textAlign: captionLeft && 'left' }}>
      {caption}
    </figcaption>
  </figure>
);
