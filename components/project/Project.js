import React, { Component } from 'react';
import Link from 'next/link';
import s from './Project.css';
import Eye from '~/static/img/eye.svg';
import External from '~/static/img/external.svg';

export default ({
  id,
  title,
  subtitle,
  image,
  phone,
  caseStudy,
  external,
  video,
}) => (
  <li className={s.project}>
    {phone && !video ? (
      <div className={s.phone}>
        <img src={image.src} alt={title} />
      </div>
    ) : null}
    {!phone && image ? (
      <div className={s.border}>
        <img src={image.src} alt={title} />
      </div>
    ) : null}
    {!phone && video ? (
      <div className={s.border}>
        <video autoPlay loop mute src={video.src} poster={video.poster} />
      </div>
    ) : null}
    <h2>{title}</h2>
    <h3>{subtitle}</h3>
  </li>
);

// {caseStudy ? (
//       <Link prefetch href={`/projects/${id}`}>
//         <a className={['button', s.caseStudy].join(' ')}>
//           <Eye />Case study
//         </a>
//       </Link>
//     ) : null}
//     {external ? (
//       <a
//         className={['button', s.external].join(' ')}
//         href={external}
//         target="_blank"
//       >
//         <External />Website
//       </a>
//     ) : null}
