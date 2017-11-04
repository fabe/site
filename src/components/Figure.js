import React from 'react';

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
  marginTop,
  marginBottom,
}) => (
  <figure
    className={`${background && 'background'} ${slim && 'slim'} ${align}`}
    style={{
      marginTop: marginTop ? '4rem' : '',
      marginBottom: marginBottom ? '4rem' : 0,
    }}
  >
    {!video ? (
      <img
        src={src}
        alt={name || caption}
        style={{ maxWidth: fullWidth && '100%' }}
      />
    ) : (
      <video src={src} autoPlay loop muted />
    )}
    {link && (
      <a href={src} target="_blank" className="link external">
        Open in new Tab
      </a>
    )}
    <figcaption style={{ textAlign: captionLeft && 'left' }}>
      {caption}
    </figcaption>
  </figure>
);
