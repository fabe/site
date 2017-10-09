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
}) => (
  <figure
    className={`${background && 'background'} ${slim && 'slim'} ${align}`}
  >
    <img
      src={src}
      alt={name || caption}
      style={{ maxWidth: fullWidth && '100%' }}
    />
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
