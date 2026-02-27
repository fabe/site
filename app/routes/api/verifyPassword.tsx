import { createFileRoute } from "@tanstack/react-router";

const failedAttempts = new Map<
  string,
  { count: number; firstAttempt: number }
>();

const MAX_FAILED_ATTEMPTS = 10;
const RESET_TIME = 60 * 60 * 1000;

const parsePersonalizedCodes = () => {
  const codes: { [key: string]: string } = {};
  const defaultPassword = process.env.PROTECTED_AREA_PASSWORD;

  if (defaultPassword) {
    codes.default = defaultPassword;
  }

  const personalizedCodes = process.env.PERSONALIZED_CODES;
  if (personalizedCodes) {
    personalizedCodes.split(",").forEach((entry) => {
      const [identifier, code] = entry.split(":").map((s) => s.trim());
      if (identifier && code) {
        codes[identifier] = code;
      }
    });
  }

  return codes;
};

const getClientIP = (request: Request) => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
};

const isBlocked = (clientIP: string) => {
  const record = failedAttempts.get(clientIP);
  if (!record) return false;

  if (Date.now() - record.firstAttempt > RESET_TIME) {
    failedAttempts.delete(clientIP);
    return false;
  }

  return record.count >= MAX_FAILED_ATTEMPTS;
};

const recordFailedAttempt = (clientIP: string) => {
  const now = Date.now();
  const record = failedAttempts.get(clientIP);

  if (!record) {
    failedAttempts.set(clientIP, { count: 1, firstAttempt: now });
  } else {
    if (now - record.firstAttempt > RESET_TIME) {
      failedAttempts.set(clientIP, { count: 1, firstAttempt: now });
    } else {
      record.count++;
    }
  }
};

export const Route = createFileRoute("/api/verifyPassword")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { password } = (await request.json()) as { password: string };
        const clientIP = getClientIP(request);

        if (isBlocked(clientIP)) {
          return new Response(
            JSON.stringify({
              error:
                "Access blocked. Contact me if you need access, my email is desk@fabianschultz.com",
              blocked: true,
            }),
            {
              status: 423,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const validCodes = parsePersonalizedCodes();
        let matchedIdentifier: string | null = null;

        for (const [identifier, code] of Object.entries(validCodes)) {
          if (password === code) {
            matchedIdentifier = identifier;
            break;
          }
        }

        if (matchedIdentifier) {
          failedAttempts.delete(clientIP);

          const cookies = [
            `password=${password}; Path=/; HttpOnly; SameSite=Strict`,
          ];

          if (matchedIdentifier !== "default") {
            cookies.push(
              `personalization=${matchedIdentifier}; Path=/; SameSite=Strict`,
            );
          }

          return new Response(
            JSON.stringify({
              personalization:
                matchedIdentifier !== "default" ? matchedIdentifier : null,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookies.join(", "),
              },
            },
          );
        } else {
          recordFailedAttempt(clientIP);
          return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
