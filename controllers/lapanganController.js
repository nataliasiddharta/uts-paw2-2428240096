const mongoose = require('mongoose');
const Lapangan = require('../models/lapanganModel');
const Venue = require('../models/venueModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['nama', 'kodeLapangan', 'tarifPerJam', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['kodeLapangan', 'nama', 'tarifPerJam', 'jenisLantai', 'fasilitas', 'venueId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

function tanganiError(err) {
  if (err.status) return err;
  if (err.code === 11000) {
    return errorHttp(409, 'kodeLapangan sudah digunakan');
  }
  if (err.name === 'CastError') {
    return errorHttp(400, `Format ${err.path || 'ID'} tidak valid`);
  }
  if (err.name === 'ValidationError') {
    return errorHttp(400, err.message);
  }
  return err;
}

exports.create = async (req, res, next) => {
  try {
    if (req.body.venueId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.venueId)) {
        throw errorHttp(400, 'venueId tidak valid / Venue tidak ditemukan');
      }
      const venueAda = await Venue.findById(req.body.venueId);
      if (!venueAda) {
        throw errorHttp(400, 'venueId tidak valid / Venue tidak ditemukan');
      }
    }

    const lapangan = await Lapangan.create(req.body);
    res.status(201).json(lapangan);
  } catch (err) {
    next(tanganiError(err));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.jenisLantai) {
      filter.jenisLantai = String(req.query.jenisLantai);
    }
    if (req.query.venue) {
      const venue = await Venue.findOne({ kode: String(req.query.venue).toUpperCase() });
      // Kode venue tidak dikenal -> hasil kosong ($in: [] tidak cocok dengan apa pun)
      filter.venueId = venue ? venue._id : { $in: [] };
    }

    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

    // Sorting: ?sort=nama (naik) atau ?sort=-nama (turun). Bawaan: terbaru dulu
    const sortParam = String(req.query.sort || '-createdAt');
    const arah = sortParam.startsWith('-') ? -1 : 1;
    const sortField = sortParam.replace(/^-/, '');
    if (!FIELD_SORT.includes(sortField)) {
      throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
    }

    // Projection: ?fields=nama,tarifPerJam
    let select = '';
    if (req.query.fields) {
      const fields = String(req.query.fields).split(',').map((f) => f.trim());
      if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
        throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
      }
      select = fields.join(' ');
    }

    const query = Lapangan.find(filter)
      .select(select)
      .sort({ [sortField]: arah, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // populate() otomatis menambahkan venueId ke hasil, jadi hanya dipanggil
    // bila venueId memang diminta (atau bila tidak ada pemilihan field)
    if (!select || select.split(' ').includes('venueId')) {
      query.populate('venueId', 'kode nama');
    }

    const [data, total] = await Promise.all([query, Lapangan.countDocuments(filter)]);

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(tanganiError(err));
  }
};

exports.getById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw errorHttp(400, 'Format ID tidak valid');
    }
    const data = await Lapangan.findById(req.params.id).populate('venueId');
    if (!data) throw errorHttp(404, 'Data tidak ditemukan');
    res.json(data);
  } catch (err) {
    next(tanganiError(err));
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw errorHttp(400, 'Format ID tidak valid');
    }

    if (req.body.venueId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.venueId)) {
        throw errorHttp(400, 'venueId tidak valid / Venue tidak ditemukan');
      }
      const venueAda = await Venue.findById(req.body.venueId);
      if (!venueAda) {
        throw errorHttp(400, 'venueId tidak valid / Venue tidak ditemukan');
      }
    }

    const data = await Lapangan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) throw errorHttp(404, 'Data tidak ditemukan');
    res.json(data);
  } catch (err) {
    next(tanganiError(err));
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw errorHttp(400, 'Format ID tidak valid');
    }
    const data = await Lapangan.findByIdAndDelete(req.params.id);
    if (!data) throw errorHttp(404, 'Data tidak ditemukan');
    res.status(204).send();
  } catch (err) {
    next(tanganiError(err));
  }
};

