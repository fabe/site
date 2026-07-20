import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { PLAYLIST_IDS } from "../constants";

const CALLBACK_PORT = 8888;
const CALLBACK_PATH = "/callback";
const REDIRECT_URI = `http://127.0.0.1:${CALLBACK_PORT}${CALLBACK_PATH}`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];
const PRODUCTION_URL = "https://fs.fyi";
const GITHUB_REPOSITORY = "fabe/site";
const REMINDER_ISSUE_TITLE = "Reauthorize Spotify access";

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

type SpotifyError = {
  error?: {
    message?: string;
  };
};

function run(
  command: string,
  args: string[],
  options: {
    input?: string;
    capture?: boolean;
  } = {},
) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    input: options.input,
    stdio: options.capture ? "pipe" : ["pipe", "inherit", "inherit"],
  });

  if (result.error) {
    throw new Error(`Unable to run ${command}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const detail = options.capture ? result.stderr.trim() : "";
    throw new Error(
      `${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`,
    );
  }

  return result.stdout;
}

function requireCommand(command: string) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(
      `${command} is required. Install it and authenticate before retrying.`,
    );
  }
}

function readPulledCredential(name: string) {
  const content = readFileSync(".env.local", "utf8");
  const line = content
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith(`${name}=`));

  if (!line) return undefined;

  const value = line.slice(name.length + 1);
  if (value.startsWith('"') && value.endsWith('"')) {
    return value
      .slice(1, -1)
      .replaceAll("\\n", "\n")
      .replaceAll("\\r", "\r")
      .replaceAll('\\"', '"')
      .replaceAll("\\\\", "\\");
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }

  return value;
}

function openBrowser(url: string) {
  const command =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

function waitForAuthorization(clientId: string) {
  return new Promise<string>((resolve, reject) => {
    const state = randomBytes(24).toString("hex");
    const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authorizationUrl.searchParams.set("scope", SCOPES.join(" "));
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("show_dialog", "true");

    const timeout = setTimeout(
      () => {
        server.close();
        reject(new Error("Spotify authorization timed out after five minutes"));
      },
      5 * 60 * 1000,
    );

    const finish = (error?: Error, code?: string) => {
      clearTimeout(timeout);
      server.close();
      if (error) reject(error);
      else if (code) resolve(code);
    };

    const server = createServer((request, response) => {
      const requestUrl = new URL(request.url ?? "/", REDIRECT_URI);

      if (requestUrl.pathname !== CALLBACK_PATH) {
        response.writeHead(404).end();
        return;
      }

      const returnedState = requestUrl.searchParams.get("state");
      const code = requestUrl.searchParams.get("code");
      const oauthError = requestUrl.searchParams.get("error");

      if (oauthError) {
        response.writeHead(400, { "content-type": "text/plain" });
        response.end(
          "Spotify authorization was denied. Return to the terminal.",
        );
        finish(new Error(`Spotify authorization failed: ${oauthError}`));
        return;
      }

      if (returnedState !== state || !code) {
        response.writeHead(400, { "content-type": "text/plain" });
        response.end("Spotify authorization could not be verified.");
        finish(new Error("Spotify returned an invalid OAuth callback"));
        return;
      }

      response.writeHead(200, { "content-type": "text/plain" });
      response.end("Spotify authorization succeeded. You can close this tab.");
      finish(undefined, code);
    });

    server.on("error", (error) => {
      clearTimeout(timeout);
      reject(
        new Error(
          `Unable to start the callback server on port ${CALLBACK_PORT}: ${error.message}`,
        ),
      );
    });

    server.listen(CALLBACK_PORT, "127.0.0.1", () => {
      console.log("Opening Spotify authorization in your browser...");
      openBrowser(authorizationUrl.toString());
    });
  });
}

async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as SpotifyError | null;
  return body?.error?.message ?? `HTTP ${response.status}`;
}

async function exchangeAuthorizationCode(
  code: string,
  clientId: string,
  clientSecret: string,
) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });
  const token = (await response.json()) as TokenResponse;

  if (!response.ok || !token.access_token || !token.refresh_token) {
    const message =
      token.error_description ?? token.error ?? `HTTP ${response.status}`;
    throw new Error(`Spotify token exchange failed: ${message}`);
  }

  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
  };
}

async function spotifyRequest(path: string, accessToken: string) {
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function validateSpotifyAccess(accessToken: string) {
  const profile = await spotifyRequest("/me", accessToken);
  if (!profile.ok) {
    throw new Error(
      `Spotify profile validation failed: ${await readError(profile)}`,
    );
  }

  const nowPlaying = await spotifyRequest(
    "/me/player/currently-playing",
    accessToken,
  );
  if (!nowPlaying.ok && nowPlaying.status !== 204) {
    throw new Error(
      `Spotify now-playing validation failed: ${await readError(nowPlaying)}`,
    );
  }

  if (nowPlaying.status === 204) {
    const recentlyPlayed = await spotifyRequest(
      "/me/player/recently-played?limit=1",
      accessToken,
    );
    if (!recentlyPlayed.ok) {
      throw new Error(
        `Spotify recently-played validation failed: ${await readError(recentlyPlayed)}`,
      );
    }
  }

  const playlist = await spotifyRequest(
    `/playlists/${PLAYLIST_IDS[0]}`,
    accessToken,
  );
  if (!playlist.ok) {
    throw new Error(
      `Spotify playlist validation failed: ${await readError(playlist)}`,
    );
  }
}

function updateVercelToken(refreshToken: string) {
  run(
    "vercel",
    ["env", "add", "SPOTIFY_REFRESH_TOKEN", "production", "--force"],
    { input: refreshToken },
  );
  run("vercel", [
    "env",
    "pull",
    ".env.local",
    "--environment=production",
    "--yes",
  ]);
}

function getLatestProductionDeployment() {
  const output = run(
    "vercel",
    ["list", "--environment", "production", "--status", "READY"],
    { capture: true },
  );
  const deployments = output.match(/https:\/\/[^\s]+\.vercel\.app/g);

  if (!deployments?.[0]) {
    throw new Error("Unable to find the latest production deployment");
  }

  return deployments[0];
}

function redeployProduction() {
  const deployment = getLatestProductionDeployment();
  run("vercel", ["redeploy", deployment, "--target", "production"]);
}

async function graphqlRequest(query: string, variables?: object) {
  const response = await fetch(`${PRODUCTION_URL}/api/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await response.json()) as {
    data?: unknown;
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || body.errors?.length || !body.data) {
    throw new Error(
      `Production GraphQL validation failed: ${
        body.errors?.[0]?.message ?? `HTTP ${response.status}`
      }`,
    );
  }
}

async function validateProduction() {
  const playlistsPage = await fetch(`${PRODUCTION_URL}/playlists`);
  if (!playlistsPage.ok) {
    throw new Error(
      `Production playlists page returned HTTP ${playlistsPage.status}`,
    );
  }

  await graphqlRequest(
    `query PlaylistQuery($id: String!) {
      spotifyPlaylist(id: $id) {
        name
        trackCount
      }
    }`,
    { id: PLAYLIST_IDS[0] },
  );
  await graphqlRequest(`query MusicStatusQuery {
    spotifyStatus {
      isPlaying
    }
  }`);
}

function recordAuthorizationDate() {
  const authorizedAt = new Date().toISOString().slice(0, 10);
  run("gh", [
    "variable",
    "set",
    "SPOTIFY_AUTHORIZED_AT",
    "--body",
    authorizedAt,
    "--repo",
    GITHUB_REPOSITORY,
  ]);

  const issues = JSON.parse(
    run(
      "gh",
      [
        "issue",
        "list",
        "--repo",
        GITHUB_REPOSITORY,
        "--state",
        "open",
        "--search",
        `"${REMINDER_ISSUE_TITLE}" in:title`,
        "--json",
        "number,title",
      ],
      { capture: true },
    ),
  ) as Array<{ number: number; title: string }>;

  for (const issue of issues) {
    if (issue.title !== REMINDER_ISSUE_TITLE) continue;
    run("gh", [
      "issue",
      "close",
      String(issue.number),
      "--repo",
      GITHUB_REPOSITORY,
      "--reason",
      "completed",
      "--comment",
      "Spotify access was reauthorized successfully.",
    ]);
  }
}

function printHelp() {
  console.log(`Reauthorize the site's Spotify integration.

Usage:
  pnpm spotify:reauthorize
  pnpm spotify:reauthorize --check

Prerequisites:
  - Spotify redirect URI ${REDIRECT_URI}
  - Authenticated Vercel CLI linked to this project
  - Authenticated GitHub CLI with access to ${GITHUB_REPOSITORY}`);
}

async function main() {
  if (process.argv.includes("--help")) {
    printHelp();
    return;
  }

  requireCommand("vercel");
  requireCommand("gh");

  console.log("Pulling production credentials from Vercel...");
  run("vercel", [
    "env",
    "pull",
    ".env.local",
    "--environment=production",
    "--yes",
  ]);

  const clientId = readPulledCredential("SPOTIFY_CLIENT_ID");
  const clientSecret = readPulledCredential("SPOTIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    throw new Error(
      "SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be configured in Vercel",
    );
  }

  if (process.argv.includes("--check")) {
    getLatestProductionDeployment();
    console.log("Spotify reauthorization prerequisites are ready.");
    return;
  }

  const code = await waitForAuthorization(clientId);
  console.log("Exchanging and validating the new Spotify authorization...");
  const token = await exchangeAuthorizationCode(code, clientId, clientSecret);
  await validateSpotifyAccess(token.accessToken);

  console.log("Updating Vercel and redeploying production...");
  updateVercelToken(token.refreshToken);
  redeployProduction();

  console.log("Verifying production...");
  await validateProduction();

  console.log("Updating the GitHub reminder date...");
  recordAuthorizationDate();
  console.log("Spotify reauthorization completed successfully.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Spotify reauthorization failed: ${message}`);
  process.exitCode = 1;
});
