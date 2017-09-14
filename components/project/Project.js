import React, { Component } from 'react';
import Link from 'next/link';
import s from './Project.css';

export default ({ id, title, subtitle, image }) =>
  <li className={s.project}>
    <Link prefetch href={`/projects/${id}`}>
      <a>
        <div className={s.cover} style={{ height: image.height }}>
          <div
            className={s.cover__front}
            style={{
              backgroundImage: `url(${image.front})`,
              backgroundColor: image.backColor,
              backgroundPosition: image.position,
              backgroundSize: image.frontSize,
            }}
          />
          <div
            className={s.cover__back}
            style={{ backgroundImage: `url(${image.back})` }}
          />
        </div>
        <p>
          {title}
        </p>
        <h2>
          {subtitle}
        </h2>
      </a>
    </Link>
  </li>;
