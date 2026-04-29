const jwt = require("jsonwebtoken");
const secret = "secret";
const authMiddleware = (req, res, next) => {
  //token --> rrq.headers
  //token should be bearer token..
  const token = req.headers.authorization;
  if (token) {
    if (token.startsWith("Bearer ")) {
      //Bearer jas;sojsaiomnsuapisagoias;sajhuoashsailhas;oasjaso
      const tokenValue = token.split(" ")[1];
      try {
        const decoded = jwt.verify(tokenValue,secret);
        //console.log(decoded);
        req.user = decoded
        next();
      } catch (err) {
        res.status(401).json({
          message: "invalid token",
          err: err,
        });
      }
    } else {
      res.status(400).json({
        message: "token must be bearer token",
      });
    }
  } else {
    res.status(401).json({
      message: "token is not presnet..",
    });
  }
};

module.exports = authMiddleware