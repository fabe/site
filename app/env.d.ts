/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_KEY: string;
  readonly VITE_VERCEL_GIT_COMMIT_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@mavrin/remark-typograf" {
  const remarkTypograf: any;
  export default remarkTypograf;
}
