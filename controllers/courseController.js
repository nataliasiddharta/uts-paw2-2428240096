// CONTROLLER: menangani request, validasi, dan response
const Course = require("../models/courseModel");

const notFound = (res, id) =>
  res.status(404).json({
    status: "error",
    message: `Data dengan id ${id} tidak ditemukan`,
    data: null,
  });

exports.getAll = (req, res) => {
  res.json(Course.getAll(req.query.semester));
};

exports.getOne = (req, res) => {
  const id = parseInt(req.params.id);
  const course = Course.getById(id);
  if (!course) return notFound(res, id);
  res.json(course);
};

exports.create = (req, res) => {
  const body = req.body || {};
  const pesan = Course.validasi(body);
  if (pesan) {
    return res.status(400).json({ status: "error", message: pesan, data: null });
  }
  const baru = Course.create(body);
  res.status(201).json({
    status: "success",
    message: "Data mata kuliah berhasil ditambahkan",
    data: baru,
  });
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  if (!Course.getById(id)) return notFound(res, id);
  const body = req.body || {};
  const pesan = Course.validasi(body);
  if (pesan) {
    return res.status(400).json({ status: "error", message: pesan, data: null });
  }
  const hasil = Course.replace(id, body);
  res.status(200).json({
    status: "success",
    message: "Data mata kuliah berhasil diubah",
    data: hasil,
  });
};

exports.remove = (req, res) => {
  const id = parseInt(req.params.id);
  if (!Course.remove(id)) return notFound(res, id);
  res.status(200).json({
    status: "success",
    message: `Data mata kuliah dengan id ${id} berhasil dihapus`,
    data: null,
  });
};
