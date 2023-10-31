import { gql } from "@apollo/client";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { Place } from "next-seo/lib/types";

import {
  Book,
  Photo,
  Playlist,
  Post,
  PostWithoutBody,
  QueryPhotosArgs,
  QueryPlaylistsArgs,
  QueryPostArgs,
  QueryPostsArgs,
  SiteSettings,
} from "../../types/types.generated";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_DELIVERY,
  GLOBE_CONTENTFUL_SPACE_ID,
  GLOBE_CONTENTFUL_DELIVERY,
} = process.env;
const SITE_SETTINGS_ENTRY_ID = "4VjpvaxnxzRE0XPfQjwHQK";
const BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;
const GLOBE_BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${GLOBE_CONTENTFUL_SPACE_ID}`;

export const contentfulClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: BASE_URL,
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_DELIVERY}`,
    },
  }),
  cache: new InMemoryCache(),
});

export const contentfulGlobeClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: GLOBE_BASE_URL,
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${GLOBE_CONTENTFUL_DELIVERY}`,
    },
  }),
  cache: new InMemoryCache(),
});

export async function getPlaylists(
  _: any,
  args: QueryPlaylistsArgs,
): Promise<Playlist[]> {
  const response = await contentfulClient.query({
    query: gql`
      query getAllPlaylists($limit: Int) {
        playlistCollection(limit: $limit) {
          items {
            title
            cover {
              url
            }
            spotifyUrl
          }
        }
      }
    `,
    variables: {
      limit: args.limit,
    },
  });

  if (!response.data) {
    return [];
  }

  return response.data.playlistCollection.items.map(
    (playlist: {
      title: string;
      cover: { url: string };
      spotifyUrl: string;
    }) => ({
      title: playlist.title,
      coverUrl: playlist.cover.url,
      spotifyUrl: playlist.spotifyUrl,
    }),
  );
}

export async function getPosts(
  _: any,
  args: QueryPostsArgs,
): Promise<PostWithoutBody[]> {
  const response = await contentfulClient.query({
    query: gql`
      query getAllPosts($limit: Int) {
        postCollection(
          limit: $limit
          where: { unlisted: false }
          order: publishedDate_DESC
        ) {
          items {
            title
            slug
            publishedDate
            metaDescription
            coverImage {
              url
            }
          }
        }
      }
    `,
    variables: {
      limit: args.limit || undefined,
    },
  });

  if (!response.data) {
    return [];
  }

  return response.data.postCollection.items.map((post: any) => ({
    title: post.title,
    slug: post.slug,
    coverUrl: post.cover?.url,
    publishedDate: post.publishedDate,
    metaDescription: post.metaDescription,
  }));
}

export async function getPost(
  _: any,
  args: QueryPostArgs,
): Promise<Post | null> {
  const response = await contentfulClient.query({
    query: gql`
      query getPost($slug: String!) {
        postCollection(where: { slug: $slug }, limit: 1) {
          items {
            title
            slug
            body
            coverImage {
              url
              description
            }
            metaDescription
            publishedDate
            tags
          }
        }
      }
    `,
    variables: {
      slug: args.slug,
    },
  });

  if (!response.data) {
    return null;
  }

  return response.data.postCollection.items.map((post: any) => ({
    title: post.title,
    slug: post.slug,
    coverUrl: post.coverImage?.url,
    coverAlt: post.coverImage?.description,
    publishedDate: post.publishedDate,
    body: post.body,
    metaDescription: post.metaDescription,
    tags: post.tags,
  }))[0];
}

export async function getPhotos(
  _: any,
  args: QueryPhotosArgs,
): Promise<Photo[]> {
  const response = await contentfulClient.query({
    query: gql`
      query getAllPhotos($limit: Int) {
        photoCollection(limit: $limit) {
          items {
            lens
            camera
            location {
              lat
              lon
            }
            description
            unsplashUrl
            asset {
              url
              width
              height
            }
          }
        }
      }
    `,
    variables: {
      limit: args.limit,
    },
  });

  if (!response.data) {
    return [];
  }

  return response.data.photoCollection.items.map((photo: any) => ({
    camera: photo.camera,
    description: photo.description,
    height: photo.asset.height,
    lens: photo.lens,
    location: photo.location,
    photoUrl: photo.asset.url,
    unsplashUrl: photo.unsplashUrl,
    width: photo.asset.width,
  }));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const response = await contentfulClient.query({
    query: gql`
      query getSiteSettings($id: String!) {
        siteSettings(id: $id) {
          siteTitle
          intro
          flags
          metaDescription
          avatar {
            url
          }
        }
      }
    `,
    variables: {
      id: SITE_SETTINGS_ENTRY_ID,
    },
  });

  if (!response.data) {
    return null;
  }

  return response.data.siteSettings;
}

export async function getPlaces(_: any): Promise<Place[]> {
  const response = await contentfulGlobeClient.query({
    query: gql`
      query getAllPlaces {
        placeCollection(limit: 500, where: { bucketList_not: true }) {
          total
          items {
            name
            type {
              name
            }
            location {
              lat
              lon
            }
          }
        }
      }
    `,
  });

  if (!response.data) {
    return [];
  }

  return response.data.placeCollection.items.map((place: any) => ({
    name: place.name,
    locationType: place.type.name,
    location: {
      lat: place.location.lat,
      lon: place.location.lon,
    },
  }));
}
