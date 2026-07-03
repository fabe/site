import { gql } from "@apollo/client";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { Place } from "../../types/types.generated";
import { proxiedImageUrl } from "../../../lib/imageProxy";

const proxyContentfulUrl = (url: string) =>
  proxiedImageUrl(
    url.replace("downloads.ctfassets.net", "images.ctfassets.net"),
  );

import {
  Photo,
  PhotoSet,
  Playlist,
  Post,
  PostWithoutBody,
  QueryPhotoArgs,
  QueryPhotosArgs,
  QueryPhotoSetArgs,
  QueryPhotoSetsArgs,
  QueryPlaylistsArgs,
  QueryPostArgs,
  QueryPostsArgs,
  SiteSettings,
} from "../../types/types.generated";

const SITE_SETTINGS_ENTRY_ID = "4VjpvaxnxzRE0XPfQjwHQK";

type ContentfulAsset = {
  url: string;
  width: number;
  height: number;
};

type CloudinaryAsset = {
  secure_url?: string;
  url?: string;
  original_secure_url?: string;
  original_url?: string;
  width?: number;
  height?: number;
  public_id?: string;
};

type ContentfulPhoto = {
  sys: { id: string };
  description?: string | null;
  cloudinaryImage?: CloudinaryAsset[] | CloudinaryAsset | null;
  asset: ContentfulAsset;
  exif?: EXIF | null;
  tags?: string[] | null;
  location?: Place["location"] | null;
};

type ContentfulPhotoSet = {
  sys: { id: string; publishedAt: string };
  title: string;
  slug: string;
  description?: string | null;
  featuredPhoto: ContentfulPhoto;
  photosCollection?: { items: Array<{ sys: { id: string } }> };
};

function getCloudinaryAsset(
  cloudinaryImage: ContentfulPhoto["cloudinaryImage"],
): CloudinaryAsset | null {
  if (Array.isArray(cloudinaryImage)) return cloudinaryImage[0] ?? null;
  return cloudinaryImage ?? null;
}

function getPhotoImageUrl(photo: ContentfulPhoto): string {
  const cloudinaryAsset = getCloudinaryAsset(photo.cloudinaryImage);
  const url =
    cloudinaryAsset?.original_secure_url ??
    cloudinaryAsset?.original_url ??
    cloudinaryAsset?.secure_url ??
    cloudinaryAsset?.url;

  if (url) return url.replace(/^http:/, "https:");
  return proxyContentfulUrl(photo.asset.url);
}

function getPhotoWidth(photo: ContentfulPhoto): number {
  return getCloudinaryAsset(photo.cloudinaryImage)?.width ?? photo.asset.width;
}

function getPhotoHeight(photo: ContentfulPhoto): number {
  return getCloudinaryAsset(photo.cloudinaryImage)?.height ?? photo.asset.height;
}

let _contentfulClient: ApolloClient | null = null;
let _contentfulGlobeClient: ApolloClient | null = null;

function getContentfulClient() {
  if (!_contentfulClient) {
    const BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
    _contentfulClient = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: BASE_URL,
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY}`,
        },
      }),
      cache: new InMemoryCache(),
    });
  }
  return _contentfulClient;
}

function getContentfulGlobeClient() {
  if (!_contentfulGlobeClient) {
    const GLOBE_BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${process.env.GLOBE_CONTENTFUL_SPACE_ID}`;
    _contentfulGlobeClient = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: GLOBE_BASE_URL,
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${process.env.GLOBE_CONTENTFUL_DELIVERY}`,
        },
      }),
      cache: new InMemoryCache(),
    });
  }
  return _contentfulGlobeClient;
}

export async function getPlaylists(
  _: unknown,
  args: QueryPlaylistsArgs,
): Promise<Playlist[]> {
  const response = await getContentfulClient().query({
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
      coverUrl: proxiedImageUrl(playlist.cover.url),
      spotifyUrl: playlist.spotifyUrl,
    }),
  );
}

export async function getPosts(
  _: unknown,
  args: QueryPostsArgs,
): Promise<PostWithoutBody[]> {
  const response = await getContentfulClient().query({
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
    coverUrl: proxiedImageUrl(post.cover?.url),
    publishedDate: post.publishedDate,
    metaDescription: post.metaDescription,
  }));
}

export async function getPost(
  _: unknown,
  args: QueryPostArgs,
): Promise<Post | null> {
  const response = await getContentfulClient().query({
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
    coverUrl: proxiedImageUrl(post.coverImage?.url),
    coverAlt: post.coverImage?.description,
    publishedDate: post.publishedDate,
    body: post.body,
    metaDescription: post.metaDescription,
    tags: post.tags,
  }))[0];
}

export async function getPhoto(
  _: unknown,
  args: QueryPhotoArgs,
): Promise<Photo | null> {
  const response = await getContentfulClient().query({
    query: gql`
      query getPhoto($id: String!) {
        photo(id: $id) {
          sys {
            id
          }
          location {
            lat
            lon
          }
          description
          cloudinaryImage
          asset {
            url
            width
            height
          }
          exif
          tags
        }
      }
    `,
    variables: {
      id: args.id,
    },
  });

  if (!response.data) {
    return null;
  }

  const photo = response.data.photo;

  return {
    id: photo.sys.id,
    description: photo.description,
    exif: photo.exif,
    height: getPhotoHeight(photo),
    location: photo.location,
    url: getPhotoImageUrl(photo),
    tags: photo.tags,
    width: getPhotoWidth(photo),
  };
}

export async function getPhotos(
  _: unknown,
  args: QueryPhotosArgs,
): Promise<Photo[]> {
  const response = await getContentfulClient().query({
    query: gql`
      query getAllPhotos($limit: Int) {
        photoCollection(limit: $limit) {
          items {
            sys {
              id
            }
            location {
              lat
              lon
            }
            description
            cloudinaryImage
            asset {
              url
              width
              height
            }
            exif
            tags
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

  return response.data.photoCollection.items.map((photo: ContentfulPhoto) => ({
    id: photo.sys.id,
    description: photo.description,
    exif: photo.exif,
    height: getPhotoHeight(photo),
    location: photo.location,
    url: getPhotoImageUrl(photo),
    tags: photo.tags,
    width: getPhotoWidth(photo),
  }));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const response = await getContentfulClient().query({
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

export async function getPlaces(_: unknown): Promise<Place[]> {
  const response = await getContentfulGlobeClient().query({
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

export async function getPhotoSet(
  _: unknown,
  args: QueryPhotoSetArgs,
): Promise<PhotoSet | null> {
  const response = await getContentfulClient().query({
    query: gql`
      query getPhotoSet($slug: String!) {
        photoSetCollection(where: { slug: $slug }, limit: 1) {
          items {
            sys {
              id
              publishedAt
            }
            title
            slug
            description
            featuredPhoto {
              description
              cloudinaryImage
              asset {
                url
                width
                height
              }
            }
            photosCollection {
              items {
                sys {
                  id
                }
                location {
                  lat
                  lon
                }
                description
                cloudinaryImage
                asset {
                  url
                  width
                  height
                }
                exif
                tags
              }
            }
          }
        }
      }
    `,
    variables: {
      slug: args.slug,
    },
  });

  if (!response.data || !response.data.photoSetCollection.items.length) {
    return null;
  }

  const photoSet = response.data.photoSetCollection.items[0];

  return {
    id: photoSet.sys.id,
    updatedAt: photoSet.sys.publishedAt,
    title: photoSet.title,
    slug: photoSet.slug,
    description: photoSet.description,
    featuredPhoto: photoSet.featuredPhoto
      ? {
          ...photoSet.featuredPhoto,
          url: getPhotoImageUrl(photoSet.featuredPhoto),
          width: getPhotoWidth(photoSet.featuredPhoto),
          height: getPhotoHeight(photoSet.featuredPhoto),
        }
      : null,
    photos: photoSet.photosCollection.items.map((photo: ContentfulPhoto) => ({
      id: photo.sys.id,
      description: photo.description,
      url: getPhotoImageUrl(photo),
      width: getPhotoWidth(photo),
      height: getPhotoHeight(photo),
      exif: photo.exif,
      tags: photo.tags,
      location: photo.location,
    })),
  };
}

export async function getPhotoSets(
  _: unknown,
  args: QueryPhotoSetsArgs,
): Promise<PhotoSet[]> {
  const response = await getContentfulClient().query({
    query: gql`
      query getPhotoSets($limit: Int) {
        photoSetCollection(limit: $limit) {
          items {
            sys {
              id
              publishedAt
            }
            title
            slug
            description
            featuredPhoto {
              cloudinaryImage
              asset {
                url
                width
                height
              }
            }
            photosCollection {
              items {
                sys {
                  id
                }
              }
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

  return response.data.photoSetCollection.items.map(
    (photoSet: ContentfulPhotoSet) => ({
      id: photoSet.sys.id,
      updatedAt: photoSet.sys.publishedAt,
      title: photoSet.title,
      slug: photoSet.slug,
      description: photoSet.description,
      photos: photoSet.photosCollection?.items?.map((photo) => ({
        id: photo.sys.id,
      })),
      featuredPhoto: {
        url: getPhotoImageUrl(photoSet.featuredPhoto),
        width: getPhotoWidth(photoSet.featuredPhoto),
        height: getPhotoHeight(photoSet.featuredPhoto),
      },
    }),
  );
}
