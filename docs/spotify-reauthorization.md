# Spotify reauthorization

Spotify refresh tokens expire 180 days after authorization. A monthly GitHub
Actions workflow creates an assigned reminder issue after 150 days.

Reauthorize the production integration from a linked local checkout:

```bash
pnpm spotify:reauthorize
```

The command pulls the production credentials from Vercel, opens Spotify's
authorization page, captures the callback at
`http://127.0.0.1:8888/callback`, validates the new access, replaces the
production refresh token, redeploys and verifies the site, updates the
`SPOTIFY_AUTHORIZED_AT` GitHub Actions variable, and closes the reminder issue.
It never prints or stores the token outside `.env.local` and Vercel.

## Prerequisites

- Keep `http://127.0.0.1:8888/callback` in the Spotify app's redirect URIs.
- Authenticate the Vercel CLI and link it to the `fabianschultz` project.
- Authenticate the GitHub CLI with access to `fabe/site`.

Check those prerequisites without starting authorization:

```bash
pnpm spotify:reauthorize --check
```
