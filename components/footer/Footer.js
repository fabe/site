import React from 'react';
import config from '~/config';
import Github from '~/static/img/github.svg';
import Twitter from '~/static/img/twitter.svg';
import StackO from '~/static/img/stacko.svg';
import s from './Footer.css';

export default ({ title }) => (
  <footer role="contentinfo" className={s.footer}>
    <div>
      <p>&copy; 2017 Fabian W. Schultz</p>
    </div>
    <div>
      <ul className={s.nav}>
        <li>
          <a href="//github.com/fabe">
            <Github />
          </a>
        </li>
        <li>
          <a href="//twitter.com/fschultz_">
            <Twitter />
          </a>
        </li>
        <li>
          <a href="//stackoverflow.com/users/6941627/fabian-schultz?tab=profile">
            <StackO />
          </a>
        </li>
        <li>
          <a href="mailto:desk@fabianschultz.com">desk@fabianschultz.com</a>
        </li>
      </ul>
    </div>
  </footer>
);
