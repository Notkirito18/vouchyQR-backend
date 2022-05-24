module.exports = (req, res, next) => {
  // check headers for key
  if (req.headers.key !== process.env.API_KEY) {
    return res.status(401).json({ msg: "access unauthorized" });
  } else {
    next();
  }
};
