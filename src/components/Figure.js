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
}) => (
  <figure
    className={`${background && 'background'} ${slim && 'slim'} ${align}`}
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
