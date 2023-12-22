export default async function handler(req, res) {
  const { password } = req.body;

  if (password === process.env.PROTECTED_AREA_PASSWORD) {
    res.setHeader("Set-Cookie", `password=${password}; Path=/; HttpOnly`);
    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
