require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// GET /
app.get("/", (req, res) => {
  res.json({
    nama: "Natalia Siddharta",
    nim: "2428240096",
    topik: 4,
    resource: "Akademik - Mata Kuliah",
    endpoints: [
      "GET /courses",
      "GET /courses/:id",
      "GET /courses?semester=3",
      "POST /courses",
      "PUT /courses/:id",
      "DELETE /courses/:id",
    ],
  });
});

app.use("/courses", courseRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
}
module.exports = app;
