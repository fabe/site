# site

This is the source code of [my website](https://fabianschultz.com).

## Installation

    $ git clone git@github.com:fabe/site.git
    $ cd site
    $ pnpm install
    $ pnpm dev

The homepage reads the Goodreads "currently-reading" RSS feed on the server.
On Vercel, the parsed reading list is shared through Runtime Cache for five
minutes per region, so visitors do not each trigger a Goodreads request.
Locally, the cache falls back to process memory. Goodreads fetch failures are
not cached; prerendered deployments still show the build-time reading list.
