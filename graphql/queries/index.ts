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
    posts(limit: 5) {
      publishedDate
      title
      slug
    }
    books: books(limit: 3, collection: READING) {
      title
      author
      url
      coverUrl
    }
  }
`;

export const QUERY_SPOTIFY_STATUS = gql`
  query SpotifyStatusQuery {
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
  }
`;

export const QUERY_POST = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PostQuery($slug: String!) {
    siteSettings {
      avatar {
        url
      }
      ...SiteSettingsShared
    }
    post(slug: $slug) {
      body
      coverUrl
      coverAlt
      metaDescription
      publishedDate
      tags
      title
    }
  }
`;

export const QUERY_POSTS = gql`
  query PostsQuery {
    posts {
      publishedDate
      title
      slug
      metaDescription
    }
  }
`;

export const QUERY_POSTS_FEED = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PostsFeedQuery {
    siteSettings {
      ...SiteSettingsShared
    }
    posts(limit: 5) {
      publishedDate
      title
      slug
      metaDescription
    }
  }
`;

export const QUERY_POST_SLUGS = gql`
  query PostsSlugsQuery {
    posts {
      slug
    }
  }
`;

export const QUERY_PLAYLIST = gql`
  ${FRAGMENT_SITE_SETTINGS_SHARED}

  query PlaylistQuery($id: String!) {
    spotifyPlaylist(id: $id) {
      name
      coverUrl
      trackCount
      followerCount
      spotifyUrl
    }
  }
`;

export const QUERY_PLACES = gql`
  query PlacesQuery {
    places {
      name
      locationType
      lat
      lon
    }
  }
`;

export const QUERY_ALL_PHOTOS = gql`
  query AllPhotosQuery {
    photos {
      id
      url
      exif
      description
      width
      height
    }
  }
`;

export const QUERY_PHOTO_IDS = gql`
  query PhotoIdsQuery {
    photos {
      id
    }
  }
`;

export const QUERY_PHOTO = gql`
  query PhotoQuery($id: String!) {
    photo(id: $id) {
      id
      url
      exif
      description
      width
      height
      tags
      location {
        lon
        lat
      }
    }
  }
`;
