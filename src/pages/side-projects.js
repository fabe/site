import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';
import clients from '~/static/clients.svg';

export default ({ posts, transition, data, pathContext }) => (
  <div style={transition && transition.style}>
    <Helmet title="Fabian W. Schultz | Side Projects" />
    <article id="content">
      <div>
        <Header simple>
          <h1>Side Projects</h1>
        </Header>
        <Block align="right" style={{ marginTop: '1%' }}>
          <h3>gatsby-starter-deck</h3>
          <p>Create presentations using GatsbyJS & ReactJS.</p>
          <p>
            <a href="https://github.com/fabe/gatsby-starter-deck">
              Check it out
            </a>
          </p>

          <h3>ReactJS Workshop</h3>
          <p>
            I gave a workshop on ReactJS at my university and published the
            tutorial on GitHub.
          </p>
          <p>
            <a href="https://speakerdeck.com/fabe/i-heard-react-was-good-an-introduction-to-reactjs">
              Check out the slides
            </a>{' '}
            or{' '}
            <a href="https://github.com/fabe/react-portfolio">view the code</a>.
          </p>

          <h3>NPR Player</h3>
          <p>
            A chrome extension to stream NPR.<br />Actively used by{' '}
            {pathContext.nprUsers || 'thousands of'} people.
          </p>
          <p>
            <a href="https://chrome.google.com/webstore/detail/npr/pflcdcelbkdhfjglfpgiodfknhpdcmjl">
              Check it out
            </a>
          </p>

          <h3>Delivery</h3>
          <p>Share your design work, clutter–free.</p>
          <p>
            <a href="https://use.delivery">Check it out</a> or{' '}
            <Link to="/work/delivery">read case</Link>.
          </p>

          <h3>Geofilters.co</h3>
          <p>
            I started a small side-hustle to help people get well designed
            Snapchat Geofilters. Sold it after a while.
          </p>

          <h3>wepp</h3>
          <p>A small macOS app that converts images to WebP.</p>
          <p>
            <a href="https://github.com/fabe/wepp">Check it out</a>
          </p>

          <h3>interval</h3>
          <p>
            I built a sleep tracker with a Raspberry Pi and an accelerometer.
          </p>
          <p>
            <a href="https://github.com/fabe/interval">Check it out</a>
          </p>
        </Block>
      </div>
    </article>
  </div>
);
