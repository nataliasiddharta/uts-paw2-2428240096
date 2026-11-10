// seed.js
// Mengisi basis data dengan venue dan lapangan futsal. Aman dijalankan berulang:
// data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Venue = require('./models/venueModel');
const Lapangan = require('./models/lapanganModel');

const DAFTAR_NAMA = [
  'Lapangan A', 'Lapangan B', 'Lapangan C', 'Lapangan D', 'Lapangan E',
  'Lapangan Utama', 'Lapangan Barat', 'Lapangan Timur', 'Lapangan VIP', 'Lapangan Indoor 1',
  'Lapangan Indoor 2', 'Lapangan Futsal 1', 'Lapangan Futsal 2', 'Lapangan Futsal 3', 'Lapangan Standard'
];
const JENIS_LANTAI = ['sintetis', 'vinyl', 'interlok'];

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;
  await mongoose.connect(mongoUri);
  await Lapangan.deleteMany({});
  await Venue.deleteMany({});

  const venueList = await Venue.insertMany([
    { kode: 'VN01', nama: 'Venue Jakabaring' },
    { kode: 'VN02', nama: 'Venue Boom Futsal' },
    { kode: 'VN03', nama: 'Venue Prioritas Sport' },
  ]);

  const daftarLapangan = DAFTAR_NAMA.map((nama, i) => ({
    kodeLapangan: `LAP-${String(i + 1).padStart(2, '0')}`,
    nama,
    tarifPerJam: 80000 + (i % 5) * 15000,
    jenisLantai: JENIS_LANTAI[i % JENIS_LANTAI.length],
    fasilitas: {
      lampu: `LED ${(i % 3 + 2) * 2} titik`,
      tribun: `${(i % 3) + 1} tingkat`
    },
    venueId: venueList[i % venueList.length]._id,
  }));

  await Lapangan.insertMany(daftarLapangan);

  console.log(`Seed selesai: ${venueList.length} venue, ${daftarLapangan.length} lapangan`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
