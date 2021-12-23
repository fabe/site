import { gql } from '@apollo/client';

export const FRAGMENT_SITE_SETTINGS_SHARED = gql`
  fragment SiteSettingsShared on SiteSettings {
    siteTitle
    metaDescription
  }
`;

export const QUERY_PAGE_HOME = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PageHomeQuery($photosLimit: Int) {
    siteSettings {
      intro
      ...SiteSettingsShared
    }
    spotifyNowPlaying {
      albumImageUrl
      artist
      isPlaying
      title
      songUrl
      album
    }
    nowReading {
      title
      author
      okuUrl
    }
    photos(limit: $photosLimit) {
      photoUrl
      width
      height
      unsplashUrl
    }
  }
`;

export const QUERY_PAGE_PROJECTS = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PageProjectsQuery {
    siteSettings {
      ...SiteSettingsShared
    }
  }
`;
