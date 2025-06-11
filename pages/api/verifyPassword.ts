import withRateLimit from "../../graphql/helpers/withRateLimit";

const failedAttempts = new Map();

const MAX_FAILED_ATTEMPTS = 10;
const RESET_TIME = 60 * 60 * 1000;

// Parse personalized codes from environment variable
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

const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

const isBlocked = (clientIP) => {
  const record = failedAttempts.get(clientIP);
  if (!record) return false;

  // Check if enough time has passed to reset
  if (Date.now() - record.firstAttempt > RESET_TIME) {
    failedAttempts.delete(clientIP);
    return false;
  }

  return record.count >= MAX_FAILED_ATTEMPTS;
};

const recordFailedAttempt = (clientIP) => {
  const now = Date.now();
  const record = failedAttempts.get(clientIP);

  if (!record) {
    failedAttempts.set(clientIP, { count: 1, firstAttempt: now });
  } else {
    // Reset if enough time has passed
    if (now - record.firstAttempt > RESET_TIME) {
      failedAttempts.set(clientIP, { count: 1, firstAttempt: now });
    } else {
      record.count++;
    }
  }
};

const handler = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;
  const clientIP = getClientIP(req);

  // Check if IP is blocked due to too many failed attempts
  if (isBlocked(clientIP)) {
    return res.status(423).json({
      error:
        "Access blocked. Contact me if you need access, my email is desk@fabianschultz.com",
      blocked: true,
    });
  }

  const validCodes = parsePersonalizedCodes();
  let matchedIdentifier = null;

  // Check if password matches any valid code
  for (const [identifier, code] of Object.entries(validCodes)) {
    if (password === code) {
      matchedIdentifier = identifier;
      break;
    }
  }

  if (matchedIdentifier) {
    // Reset failed attempts on successful login
    failedAttempts.delete(clientIP);

    // Set cookies
    const cookiesToSet = [
      `password=${password}; Path=/; HttpOnly; SameSite=Strict`,
    ];

    // Add personalization cookie if it's not the default password (not HttpOnly so JS can read it)
    if (matchedIdentifier !== "default") {
      cookiesToSet.push(
        `personalization=${matchedIdentifier}; Path=/; SameSite=Strict`,
      );
    }

    res.setHeader("Set-Cookie", cookiesToSet);
    res.status(200).json({
      personalization:
        matchedIdentifier !== "default" ? matchedIdentifier : null,
    });
  } else {
    // Record failed attempt
    recordFailedAttempt(clientIP);
    res.status(401).json({
      error: "Invalid password",
    });
  }
};

export default withRateLimit(handler);
