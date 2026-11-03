// MODEL: data & fungsi pengolahan data (tanpa req/res)
let courses = [
  { id: 1, kode: "VN01", "nama":"Venue", "tempat":"Jakabaring"},
  { id: 2,"kode":"VN02","nama":"Venue", "tempat":"Jakabaring"},
  
 ,
];
let nextId = 4;

// kembalikan pesan error, atau null jika valid
function validasi(body) {
  const { kode, namaMatkul, sks, semester } = body;
  if (!kode) return "Field kode wajib diisi";
  if (!namaMatkul) return "Field namaMatkul wajib diisi";
  if (sks === undefined || sks === null || sks === "") return "Field sks wajib diisi";
  if (typeof sks !== "number") return "Field sks harus berupa angka";
  if (semester === undefined || semester === null || semester === "") return "Field semester wajib diisi";
  if (typeof semester !== "number") return "Field semester harus berupa angka";
  return null;
}

function getAll(semester) {
  if (semester !== undefined) {
    return courses.filter((c) => c.semester === parseInt(semester));
  }
  return courses;
}

function getById(id) {
  return courses.find((c) => c.id === id);
}

function create(body) {
  const baru = {
    id: nextId++,
    kode: body.kode,
    namaMatkul: body.namaMatkul,
    sks: body.sks,
    semester: body.semester,
    dosenPengampu: body.dosenPengampu || "",
  };
  courses.push(baru);
  return baru;
}

// penggantian penuh, id tetap; null jika id tidak ada
function replace(id, body) {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = {
    id,
    kode: body.kode,
    namaMatkul: body.namaMatkul,
    sks: body.sks,
    semester: body.semester,
    dosenPengampu: body.dosenPengampu || "",
  };
  return courses[index];
}

// true jika berhasil dihapus
function remove(id) {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
}

module.exports = { validasi, getAll, getById, create, replace, remove };
