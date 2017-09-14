import React, { Component } from 'react';
import Page from '~/layouts/page';
import P from '~/components/base/paragraph';
import screen from './screen.jpg';
import video from './giphy.mp4';

export default () =>
  <Page title="DSK Companion">
    <P>This is a case study in the making!</P>
    <img src={screen} alt="" />
    <video src={video} autoPlay loop />
  </Page>;
