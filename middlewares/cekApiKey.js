// melindungi rute POST, PUT, DELETE
module.exports = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({
      status: "error",
      message: "API key tidak ada atau tidak valid",
      data: null,
    });
  }
  next();
};
