import React, { Component } from 'react';
import Page from '~/layouts/page';
import P from '~/components/base/paragraph';
import screen from './screen.jpg';

export default () => (
  <Page title="DSK Companion">
    <p>
      A few days before Easter break this year I realized it was best to move
      the trip to my family two weeks into the future. I decided to spend that
      time not on university duties or a freelance gig, but to build a new side
      project.
    </p>
    <p>
      Remember Layervault? They used to offer a neat free service called
      Delivery. It made sharing and presenting design work simple, clutter-free
      and worry-less. Unfortunately, it shut down together with the company in
      2015.
    </p>
    <p>
      Fast-forward to today. Designers now use services like InVision or Marvel
      to share their design work. Including me! But often enough I look back and
      wish for a service like Delivery again. A simple and fast way to share my
      work. No sign up, no loading of my experience or limitations on the amount
      of projects I can create.
    </p>
    <p>
      So, I decided to build a new version of Delivery myself. I sat down for
      the weekend and bootstrapped use.delivery on top of React, next.js, mobx,
      S3 and Google App Engine.
    </p>
    <p>The concept is very simple:</p>
    <ol>
      <li>Add a few details about the project or the design you’re sharing.</li>
      <li>
        Upload the designs and give them a title and a description if you like.
      </li>
      <li>Save, and share!</li>
    </ol>
    <p>You can see an example here and create a new delivery right now!</p>
    <p>
      Of course, it’s not supposed to be a full alternative to established tools
      like InVision or Marvel. See it more as an alternative to sending out a
      batch of PNG files to clients without or with only little context.
    </p>
    <p>
      use.delivery is a work in progress and there’s still a few things that
      need attention. But all in all I had a great time building it in such a
      short time, which was due to the amazing technology stack I’ve used.
    </p>
    <img src={screen} alt="" />
  </Page>
);
