# RESTful API Persewaan Lapangan Futsal

Aplikasi backend RESTful API untuk pengelolaan sistem persewaan lapangan futsal yang dibangun menggunakan Express.js dan MongoDB (Mongoose). Proyek ini mengelola dua entitas utama: **Venue** (sebagai entitas pendukung) dan **Lapangan** (sebagai entitas utama).

---

## 1. Alasan Pemilihan Relasi Dokumen

Struktur data dalam proyek ini menerapkan dua pendekatan desain pemodelan MongoDB:

### a. Embedding (`fasilitas` pada Lapangan)
* **Pola Relasi**: 1-to-1 / Subdocument.
* **Alasan**:
  * Informasi `fasilitas` (lampu dan tribun) merupakan atribut pelengkap yang melekat langsung pada satu unit lapangan spesifik.
  * Data fasilitas selalu dibaca bersamaan saat klien menampilkan informasi detail lapangan, sehingga penyematan (*embedding*) sebagai subdokumen tanpa `_id` (`{ _id: false }`) mempercepat operasi pembacaan (meniadakan kebutuhan query gabungan/join).
  * Data fasilitas tidak memiliki siklus hidup independen atau kebutuhan untuk dikelola secara mandiri di luar entitas lapangan.

### b. Referencing (`venueId` pada Lapangan)
* **Pola Relasi**: 1-to-N (One Venue to Many Lapangan) via `mongoose.Schema.Types.ObjectId`.
* **Alasan**:
  * Satu venue (misalnya *Venue Jakabaring*) dapat memiliki banyak lapangan (misalnya *Lapangan A*, *Lapangan B*, dll.).
  * Menghindari redundansi dan inkonsistensi data: jika ada pembaruan nama venue, data hanya perlu diperbarui di satu tempat (dokumen venue).
  * Menghindari pertumbuhan ukuran dokumen yang tak terbatas (*unbounded document growth*) jika lapangan dimasukkan ke dalam array venue.
  * Pengambilan data nama atau kode venue pada lapangan dapat dilakukan secara selektif dengan mekanisme Mongoose `populate()`.

---

## 2. Daftar Endpoint API

### A. Endpoint Venue (`/venue`)
| Metode | Endpoint | Proteksi (`x-api-key`) | Keterangan |
| :--- | :--- | :---: | :--- |
| `GET` | `/venue` | Publik | Mendapatkan seluruh daftar venue |
| `POST` | `/venue` | Wajib | Menambahkan venue baru |

### B. Endpoint Lapangan (`/lapangan`)
| Metode | Endpoint | Proteksi (`x-api-key`) | Keterangan |
| :--- | :--- | :---: | :--- |
| `GET` | `/lapangan` | Publik | Mendapatkan daftar lapangan (mendukung filter, sort, pagination, & projection) |
| `GET` | `/lapangan/:id` | Publik | Mendapatkan detail satu lapangan beserta populate venue lengkap |
| `POST` | `/lapangan` | Wajib | Menambahkan data lapangan baru |
| `PUT` | `/lapangan/:id` | Wajib | Memperbarui data lapangan |
| `DELETE` | `/lapangan/:id` | Wajib | Menghapus data lapangan |

---

## 3. Fitur Query Parameter pada `GET /lapangan`

Endpoint `GET /lapangan` mendukung manipulasi query parameter tingkat lanjut:
* **Filtering**:
  * `?jenisLantai=vinyl` -> Memfilter lapangan berdasarkan jenis lantai (`sintetis`, `vinyl`, `interlok`).
  * `?venue=VN01` -> Memfilter lapangan berdasarkan kode venue.
* **Pagination**:
  * `?page=1&limit=10` -> Mengatur halaman dan jumlah data per halaman (bawaan: 10, batas maksimal: 50).
  * Bentuk respons: `{ data, page, limit, total, totalPages }`.
* **Sorting**:
  * `?sort=tarifPerJam` (naik) atau `?sort=-tarifPerJam` (turun).
  * Field yang diizinkan: `nama`, `kodeLapangan`, `tarifPerJam`, `createdAt` (bawaan: `-createdAt`).
* **Projection**:
  * `?fields=kodeLapangan,nama,tarifPerJam,venueId` -> Memilih field tertentu yang ingin ditampilkan.
  * Field yang diizinkan: `kodeLapangan`, `nama`, `tarifPerJam`, `jenisLantai`, `fasilitas`, `venueId`, `createdAt`.
* **Populate**:
  * Field `venueId` otomatis menyertakan informasi `kode` dan `nama` venue jika field `venueId` dipilih atau tanpa proyeksi field.

---

## 4. Contoh Format Payload & Request

### a. POST /venue
**Headers**:
```http
Content-Type: application/json
x-api-key: kunci-rahasia-futsal
```
**Body (JSON)**:
```json
{
  "kode": "VN01",
  "nama": "Venue Jakabaring"
}
```

### b. POST /lapangan
**Headers**:
```http
Content-Type: application/json
x-api-key: kunci-rahasia-futsal
```
**Body (JSON)**:
```json
{
  "kodeLapangan": "LAP-01",
  "nama": "Lapangan A",
  "tarifPerJam": 100000,
  "jenisLantai": "sintetis",
  "fasilitas": {
    "lampu": "LED 4 titik",
    "tribun": "2 tingkat"
  },
  "venueId": "650000000000000000000001"
}
```

### c. Contoh URL Query Kompleks
```http
GET /lapangan?jenisLantai=vinyl&venue=VN01&sort=-tarifPerJam&page=1&limit=5&fields=kodeLapangan,nama,tarifPerJam,venueId
```

---

## 5. Cara Menjalankan Proyek

### Prasyarat
* [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
* [MongoDB](https://www.mongodb.com/) (lokal aktif di port `27017` atau koneksi MongoDB Atlas / Docker)

### Langkah Instalasi dan Menjalankan

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variable**:
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan isi berkas `.env` bila diperlukan:
   ```env
   PORT=3000
   API_KEY=kunci-rahasia-futsal
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/persewaan_lapangan
   ```

3. **Inisialisasi Data Awal (Opsional / Seeding)**:
   Jalankan script seed untuk mengisi data dummy awal ke dalam basis data:
   ```bash
   node seed.js
   ```

4. **Jalankan Server**:
   * Mode Pengembangan (dengan nodemon):
     ```bash
     npm run dev
     ```
   * Mode Produksi:
     ```bash
     npm start
     ```
   Server akan berjalan dan dapat diakses di `http://localhost:3000`.

