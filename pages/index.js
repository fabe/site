import React, { Component } from 'react';
import Page from '~/layouts/page';
import Project from '~/components/project';
import { projects } from '~/content.json';
import s from '~/styles/home.css';

export default () =>
  <Page title="Home">
    <ul className={s.overview}>
      <li className={s.intro}>
        <h1>
          Product Designer &<br />
          Frontend Developer<br />
          from Germany.
        </h1>
        <p>Currently studying Interface Design at FH Potsdam.</p>
      </li>

      {projects.map(project => <Project key={project.id} {...project} />)}
    </ul>
  </Page>;
