import Link from "next/link";

export default function Intro() {
  return (
    <dl className="list-container">
      <dt className="list-title">
        <h1 className="flex [font-variation-settings:'wght'_480] text-white">
          <Link href="/">
            <a>Fabian Schultz</a>
          </Link>
        </h1>
        <h2 className="text-silver-dark">Product Designer</h2>
      </dt>
      <dd className="list-content">
        <p>
          I’m Fabian, a product designer currently working remotely at
          Contentful. There, I’m responsible for the design of the extensibility
          platform.
        </p>
        <p>
          Before that, I studied Interface Design at the University of Applied
          Sciences in Potsdam and interned at Stink Studios in Brooklyn, NY.
        </p>
        <p>
          I’m excited about the intersection of design and code, caring deeply
          about implementation, accessibility, and performance.
        </p>
        <p>
          Check out some mildly interesting things I coded on{" "}
          <a
            className="link"
            href="//github.com/fabe"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          or view my retweets on{" "}
          <a
            className="link"
            href="//twitter.com/fschultz_"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          . You can also{" "}
          <a
            className="link"
            href="mailto:desk@fabianschultz.com?subject=Hello!"
          >
            email me
          </a>
          .
        </p>
      </dd>
    </dl>
  );
}
