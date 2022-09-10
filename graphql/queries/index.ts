import { gql } from "@apollo/client";

export const FRAGMENT_SITE_SETTINGS_SHARED = gql`
  fragment SiteSettingsShared on SiteSettings {
    siteTitle
    metaDescription
  }
`;

export const QUERY_PAGE_HOME = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PageHomeQuery {
    siteSettings {
      intro
      ...SiteSettingsShared
    }
    spotifyStatus {
      timestamp
      isPlaying
      song {
        albumImageUrl
        artist
        title
        spotifyUrl
        album
      }
    }
    books: books(limit: 1, collection: READING) {
      title
      author
      okuUrl
      coverUrl
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
