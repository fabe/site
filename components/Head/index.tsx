import NextHead from 'next/head';
import { SiteSettings } from '../../graphql/types/types.generated';

const { GRAPHCDN_BASE_URL } = process.env;
const DIVIDER = '·';

interface HeadProps {
  siteSettings: SiteSettings;
  subpages: string[];
}

const Head = (props: HeadProps) => {
  const { siteSettings, subpages } = props;
  const title = `${siteSettings?.siteTitle}${
    subpages ? subpages.join(` ${DIVIDER} `) : null
  }`;

  return (
    <NextHead>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
      <meta name="twitter:title" content={title} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta
        name="twitter:description"
        content={siteSettings?.metaDescription}
      />
      <meta name="description" content={siteSettings?.metaDescription} />
      <link rel="dns-prefetch" href={GRAPHCDN_BASE_URL} />
    </NextHead>
  );
};

export default Head;
