import withRateLimit from "../../graphql/helpers/withRateLimit";

const handler = async function (req, res) {
  const { password } = req.body;

  if (password === process.env.PROTECTED_AREA_PASSWORD) {
    const cookieName = "password";
    const cookieValue = password;
    let cookieString = `${cookieName}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax`;

    if (process.env.NODE_ENV === "production") {
      cookieString += "; Secure";
    }

    res.setHeader("Set-Cookie", cookieString);
    res.status(200).end();
  } else {
    res.status(401).end();
  }
};

export default withRateLimit(handler);
