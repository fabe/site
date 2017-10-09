import React, { Component } from 'react';
import Page from '~/layouts/page';
import Project from '~/components/project';
import { projects } from '~/content.json';
import s from '~/styles/home.css';

const prepareProjects = projects => {
  let col1 = [];
  let col2 = [];

  projects.forEach((project, i) => {
    const node = <Project key={project.id} {...project} />;
    if (i % 2 === 0) {
      col1.push(node);
    } else {
      col2.push(node);
    }
  });

  return (
    <div className={s.projects}>
      <div>{col1}</div>
      <div>{col2}</div>
    </div>
  );
};

export default () => (
  <Page
    title="Home"
    displayTitle="Hello, I’m Fabian — a product designer<br/> and developer from Potsdam, Germany."
    className={s.home}
    fullWidth
  >
    {prepareProjects(projects)}
  </Page>
);
