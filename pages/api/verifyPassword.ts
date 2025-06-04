import withRateLimit from "../../graphql/helpers/withRateLimit";

const failedAttempts = new Map();

const MAX_FAILED_ATTEMPTS = 10;
const RESET_TIME = 60 * 60 * 1000;

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

  if (password === process.env.PROTECTED_AREA_PASSWORD) {
    // Reset failed attempts on successful login
    failedAttempts.delete(clientIP);
    res.setHeader(
      "Set-Cookie",
      `password=${password}; Path=/; HttpOnly; SameSite=Strict`,
    );
    res.status(200).end();
  } else {
    // Record failed attempt
    recordFailedAttempt(clientIP);
    res.status(401).json({
      error: "Invalid password",
    });
  }
};

export default withRateLimit(handler);
