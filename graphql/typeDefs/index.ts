import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar JSON

  type Query {
    books(limit: Int, collection: CollectionType): [Book]!
    photos(limit: Int): [Photo]!
    playlists(limit: Int): [Playlist]!
    post(slug: String!): Post
    posts(limit: Int): [PostWithoutBody]!
    siteSettings: SiteSettings!
    spotifyStatus: SpotifyStatus!
  }

  enum CollectionType {
    FAVOURITES
    READ
    READING
  }

  type SpotifyStatus {
    timestamp: String
    isPlaying: Boolean!
    song: Song
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
    okuUrl: String!
    coverUrl: String
  }

  type Post {
    title: String!
    slug: String!
    publishedDate: String!
    metaDescription: String
    coverUrl: String
    tags: [String]
    body: String!
  }

  type PostWithoutBody {
    title: String!
    slug: String!
    publishedDate: String!
    coverUrl: String
  }

  type Photo {
    lens: String
    camera: String
    location: Location
    description: String
    unsplashUrl: String
    photoUrl: String!
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
