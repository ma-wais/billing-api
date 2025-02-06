import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
