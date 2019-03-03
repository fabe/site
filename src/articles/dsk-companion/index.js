import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import articleFragment from '~/src/pages';

import video from './medical_companion_screenani.mp4';

export const frontmatter = {
  id: 'dsk',
  isWork: true,
  title: 'Helping athletes to cope with injuries',
  subtitle: 'DSK Companion',
  date: '2017-07-01',
  path: '/work/dsk-companion',
  cover: './dsk.png',
  caption: 'A Google Design Sprint',
  background: '#EBEEF1',
  excerpt: `In the spring semester 2017 at FH Potsdam, I teamed up with Kevin, Isabell and Caspar to work on a project during a class supervised by Marian Gunkel (SAP). The class focused on Lean Startups, Design Sprints and User Testing.`,
  details: [
    {
      title: 'Responsibility',
      description: 'Service Design, Visual Design, Design Sprint',
    },
    {
      title: 'Context',
      description: 'University of Applied Sciences Potsdam',
    },
    {
      title: 'Date',
      description: 'Summer 2017',
    },
  ],
};

export default props => (
  <Article {...props}>
    <Block mobilePull>
      <p>
        In the spring semester 2017 at FH Potsdam, I teamed up with{' '}
        <a href="http://kevinschiffer.com">Kevin</a>,{' '}
        <a href="https://instagram.com/julezvanderlinden">Isabell</a> and{' '}
        <a href="http://casparkirsch.de">Caspar</a> to work on a project during
        a class supervised by Marian Gunkel (<span className="caps">SAP</span>).
        The class focused on Lean Startups, Design Sprints and User Testing.
      </p>
    </Block>
    <Block align="right">
      <p>
        We asked ourselves how we can support amateur and professional athletes
        during uncertain times of injury and recovery. Together, we came up with
        DSK Companion — a service design concept for insurance companies.
      </p>
    </Block>

    <Block full>
      <Figure sizes={props.data.intro} />
    </Block>

    <hr />
    <Block vc>
      <h3>Persona & Scenario</h3>
      <p>
        We created a persona as one of our first steps in our Google Design
        Sprint process: Max, a 23 year old amateur soccer player, who suffered a
        ligament rupture during a game. He has to undergo surgery and
        rehabilitation. We documented his journey in a user story.
      </p>
    </Block>
    <Block align="right">
      <Figure sizes={props.data.persona} />
    </Block>

    <Block>
      <Figure sizes={props.data.vpc} />
    </Block>
    <Block vc align="right">
      <h3>Value Proposition Canvas</h3>
      <p>
        After that, we moved on to create a Value Proposition Canvas consisting
        of “Jobs”, “Pains” and “Gains” of our persona. We then took a vote to
        see which aspects are most important to us.
      </p>
    </Block>

    <Block>
      <h3>Ideation</h3>
      <p>
        Going forward from the Value Proposition Canvas, we were able to ask
        “How might we...” questions and generate ideas/solutions for those
        questions.
      </p>
      <p>
        We took a vote again and settled on the use of a digital timeline to
        help athlethes visualize their healing progress.
      </p>
    </Block>
    <Block vc align="right">
      <Figure link sizes={props.data.ideation} />
    </Block>

    <hr />
    <Block full pull align="center">
      <h2>Wireframing</h2>
      <p>
        We created the initial wireframes together on a whiteboard, then moved
        on to&nbsp;Figma.
      </p>
    </Block>
    <Block full>
      <Figure sizes={props.data.wireframes} />
    </Block>

    <Block>
      <Figure sizes={props.data.usertest} />
    </Block>
    <Block vc align="right">
      <h3>Prototyping & User Testing</h3>
      <p>
        With the digital wireframes on our hands we were able to build a click
        dummy and hand it to potential users.
      </p>
      <p>
        We got the feedback that the timeline was a little confusing and so we
        added additional affordances to the main screen of our app and got rid
        of some elements that added unneccesary complexity.
      </p>
    </Block>

    <hr />
    <Block full pull align="center">
      <h2>Screendesign</h2>
      <p>
        Once we were happy with our prototype, we worked out the screendesign of
        the DSK companion for iOS&nbsp;11.
      </p>
    </Block>
    <Block pull>
      <Figure
        background
        sizes={props.data.screen1}
        caption="Timeline, highlighting appointments, exercises and more."
      />
    </Block>
    <Block pull align="right">
      <Figure
        background
        sizes={props.data.screen2}
        caption="Calendar items, allowing doctors to ask for tasks to be completed by the patient."
      />
    </Block>
    <Block>
      <Figure
        background
        sizes={props.data.screen3}
        caption="A custom knowledge base for the patient."
      />
    </Block>
    <Block align="right">
      <Figure
        background
        sizes={props.data.screen4}
        caption="Chat with doctors, making it easy to request appointments or prescriptions."
      />
    </Block>

    <hr />

    <Block full pull align="center">
      <h2>Prototype</h2>
      <p>
        To showcase the screendesign and its animations, we created a prototype
        using After Effects.
      </p>
    </Block>

    <Block align="center" pull>
      <video autoPlay loop src={video} />
    </Block>
  </Article>
);

export const query = graphql`
  query GatsbyImageDSK {
    intro: file(relativePath: { eq: "dsk-companion/intro.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    persona: file(relativePath: { eq: "dsk-companion/persona.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    vpc: file(relativePath: { eq: "dsk-companion/vpc.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ideation: file(relativePath: { eq: "dsk-companion/ideation.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    wireframes: file(relativePath: { eq: "dsk-companion/wireframes.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    usertest: file(relativePath: { eq: "dsk-companion/usertest.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen1: file(relativePath: { eq: "dsk-companion/screens/1.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen2: file(relativePath: { eq: "dsk-companion/screens/2.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen3: file(relativePath: { eq: "dsk-companion/screens/3.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen4: file(relativePath: { eq: "dsk-companion/screens/4.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
