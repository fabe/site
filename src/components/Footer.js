import React from 'react';
import github from '~/static/icons/github.svg';
import stacko from '~/static/icons/stacko.svg';
import twitter from '~/static/icons/twitter.svg';
import dribbble from '~/static/icons/dribbble.svg';
import sge from '~/static/sge.svg';

export default ({ scrollTop, title }) => (
  <footer>
    <div className="container grid">
      <div className="col">
        <nav>
          <ul>
            <li className="email">
              <a
                className="link"
                href="mailto:desk@fabianschultz.com?subject=Inquiry"
              >
                desk@fabianschultz.com
              </a>
            </li>
            <li>
              <a href="//github.com/fabe" title="GitHub">
                <img src={github} alt="GitHub" />
              </a>
            </li>
            <li>
              <a href="//twitter.com/fschultz_" title="Twitter">
                <img src={twitter} alt="Twitter" />
              </a>
            </li>

            <li>
              <a
                href="//stackoverflow.com/users/6941627/fabian-schultz?tab=profile"
                title="Stack Overflow"
              >
                <img src={stacko} alt="Stack Overflow" />
              </a>
            </li>
            <li>
              <a href="//dribbble.com/fws" title="Dribbble">
                <img src={dribbble} alt="Dribbble" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="col flex">
        <span>
          &copy; {new Date().getFullYear()} {title}
        </span>
        <a href="//www.instagram.com/eintrachtfrankfurt">
          <img src={sge} alt="Eintracht Frankfurt" title="SGE Supporter 🦅" />
        </a>
      </div>
    </div>
  </footer>
);
