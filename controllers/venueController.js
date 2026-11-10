const Venue = require('../models/venueModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res, next) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Kode venue sudah digunakan' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    next(err);
  }
};

