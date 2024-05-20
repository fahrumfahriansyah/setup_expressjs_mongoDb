const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const NewTokens = sign({ username: user.username }, "membuatToken");
  return NewTokens;
};
const validateToken = (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;


  if (!accessToken) {
    return res.status(401).json({
      error: "User not authenticated",
    });
  }
  try {
    const verifyToken = verify(accessToken, "membuatToken");
    if (verifyToken) {
      res.authenticated = true;
      return next();
    }
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = { createToken, validateToken };