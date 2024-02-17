import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar JSON

  type Query {
    books(limit: Int, collection: CollectionType): [Book]!
    photos(limit: Int): [Photo]!
    playlists(limit: Int): [Playlist]!
    post(slug: String!): Post
    posts(limit: Int): [PostWithoutBody]!
    places: [Place]!
    siteSettings: SiteSettings!
    spotifyStatus: SpotifyStatus!
    spotifyPlaylist(id: String!): SpotifyPlaylist!
  }

  enum CollectionType {
    READING
  }

  type SpotifyStatus {
    timestamp: String
    isPlaying: Boolean!
    song: Song
  }

  type SpotifyPlaylist {
    name: String!
    coverUrl: String!
    trackCount: Int!
    followerCount: Int!
    spotifyUrl: String!
  }

  type Song {
    title: String
    artist: String
    album: String
    albumImageUrl: String
    spotifyUrl: String
  }

  type Playlist {
    title: String!
    coverUrl: String!
    spotifyUrl: String!
  }

  type Book {
    title: String!
    author: String!
    readingDate: String
    url: String!
    coverUrl: String
    fallbackColors: [String]
  }

  scalar Freeform

  type Post {
    title: String!
    slug: String!
    publishedDate: String!
    metaDescription: String
    coverUrl: String
    coverAlt: String
    tags: [String]
    body: Freeform!
  }

  type PostWithoutBody {
    title: String!
    slug: String!
    publishedDate: String!
    coverUrl: String
    metaDescription: String
  }

  type Place {
    name: String!
    locationType: String!
    location: Location!
  }

  type Photo {
    exif: JSON
    tags: [String]
    location: Location
    description: String
    url: String!
    width: Int!
    height: Int!
  }

  type SiteSettings {
    siteTitle: String!
    intro: String!
    flags: [Flag]
    metaDescription: String!
    avatar: Asset!
  }

  type Flag {
    key: String!
    value: String!
  }

  # Contentful types from here on out! ---------------------------------------------

  interface Entry {
    sys: Sys!
    contentfulMetadata: ContentfulMetadata!
  }

  type ContentfulMetadata {
    tags: [ContentfulTag]!
  }

  type ContentfulTag {
    id: String
    name: String
  }

  type Sys {
    id: String!
    spaceId: String!
    environmentId: String!
    publishedAt: String
    firstPublishedAt: String
    publishedVersion: Int
  }

  type Asset {
    sys: Sys!
    contentfulMetadata: ContentfulMetadata!
    title: String
    description: String
    contentType: String
    fileName: String
    size: Int
    url(transform: ImageTransformOptions): String
    width: Int
    height: Int
  }

  input ImageTransformOptions {
    width: Int
    height: Int
    quality: Int
    cornerRadius: Int
    resizeStrategy: String
    resizeFocus: String
    backgroundColor: String
    format: String
  }

  type Location {
    lat: Float
    lon: Float
  }
`;
