// 404 untuk rute yang tidak ada (dipasang setelah semua route)
const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
};

// penanganan error terpusat, termasuk JSON body rusak
const errorHandler = (err, req, res, next) => {
  res.status(400).json({
    status: "error",
    message: "Request tidak valid atau format JSON salah",
    data: null,
  });
};

module.exports = { notFound, errorHandler };
