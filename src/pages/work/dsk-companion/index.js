import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import articleFragment from '~/src/pages';

export const data = {
  id: 'dsk',
  isWork: true,
  title: 'Helping athletes to cope with injuries',
  subtitle: 'DSK Companion',
  date: '2017-07-01',
  path: '/work/dsk-companion',
  caption: 'A Google Design Sprint',
  background: '#EBEEF1',
  intro:
    'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.',
  details: [
    {
      title: 'Responsibility',
      description: 'Service Design, Visual Design, Design Sprint',
    },
    {
      title: 'Date',
      description: 'Summer 2017',
    },
  ],
};

export default props => (
  <Article path={data.path} {...props}>
    <Block>
      <p>
        In the spring semester 2017 at FH Potsdam, I teamed up with{' '}
        <a href="//kevinschiffer.com">Kevin</a>,{' '}
        <a href="//instagram.com/julezvanderlinden">Isabell</a> and{' '}
        <a href="//casparkirsch.de">Caspar</a> to work on a project during a
        class supervised by Marian Gunkel (<span className="caps">SAP</span>).
        The class focused on Lean Startups, Design Sprints and User Testing.
      </p>
    </Block>
    <Block align="right">
      <p>
        We asked outselves how we can support amateur and professional athletes
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
        We created a persona as the first step in our Google Design Sprint
        process: Max, a 23 year old amateur soccer player, who suffered a
        ligament rupture during a game. He has to undergo surgery and
        rehabilitation. We've documented his journey in a user story.
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
        After that we moved on to create a Value Proposition Canvas, consisting
        of "Jobs", "Pains" and "Gains" of our persona. We then took a vote to
        see which aspects are most important to us.
      </p>
    </Block>

    <Block>
      <h3>Ideation</h3>
      <p>
        Going forward from the Value Proposition Canvas, we were able to ask
        "How might we..." questions and generate ideas/solutions for those
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
        on to Figma.
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
  </Article>
);

export const query = graphql`
  query GatsbyImageDSK {
    intro: file(relativePath: { eq: "work/dsk-companion/intro.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1100, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    persona: file(relativePath: { eq: "work/dsk-companion/persona.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    vpc: file(relativePath: { eq: "work/dsk-companion/vpc.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    ideation: file(relativePath: { eq: "work/dsk-companion/ideation.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    wireframes: file(
      relativePath: { eq: "work/dsk-companion/wireframes.jpg" }
    ) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    usertest: file(relativePath: { eq: "work/dsk-companion/usertest.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen1: file(relativePath: { eq: "work/dsk-companion/screens/1.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen2: file(relativePath: { eq: "work/dsk-companion/screens/2.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen3: file(relativePath: { eq: "work/dsk-companion/screens/3.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    screen4: file(relativePath: { eq: "work/dsk-companion/screens/4.png" }) {
      childImageSharp {
        sizes(maxWidth: 800, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
