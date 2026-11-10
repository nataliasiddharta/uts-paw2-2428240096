const mongoose = require('mongoose');

const fasilitasSchema = new mongoose.Schema({
  lampu: String,
  tribun: String,
}, { _id: false });

const lapanganSchema = new mongoose.Schema({
  kodeLapangan: { type: String, required: [true, 'kodeLapangan wajib diisi'], unique: true, trim: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  tarifPerJam: { type: Number, required: [true, 'tarifPerJam wajib diisi'], min: [0, 'tarifPerJam minimal 0'] },
  jenisLantai: { type: String, required: [true, 'jenisLantai wajib diisi'], trim: true },
  fasilitas: fasilitasSchema,
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: [true, 'venueId wajib diisi'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lapangan', lapanganSchema);

