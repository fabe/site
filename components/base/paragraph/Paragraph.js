import React from 'react';
import s from './Paragraph.css';

export default ({ children }) =>
  <p className={s.p}>
    {children}
  </p>;
