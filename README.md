# Cek IPK

**Cek IPK** adalah aplikasi web untuk membantu mahasiswa mencatat dan memantau perkembangan Indeks Prestasi Kumulatif (IPK) berdasarkan semester. Seluruh data tersimpan secara lokal di browser sehingga tidak memerlukan akun atau koneksi internet khusus.

---

## ✨ Fitur

- **Perhitungan IPK & IP Semester** — Kalkulasi otomatis berbasis bobot nilai dan SKS tiap mata kuliah
- **Pengelolaan Semester** — Tambah, hapus, dan kelola transkrip per semester secara terstruktur
- **Pengelolaan Mata Kuliah** — Tambah, edit nilai, dan hapus mata kuliah dengan bobot SKS fleksibel
- **Grafik Perkembangan IPK** — Visualisasi tren perkembangan IPK antar-semester langsung di dashboard
- **Visualisasi Grafik Lengkap** — Modal analisis berisi grafik IP per semester dan distribusi perolehan nilai
- **Statistik Akademik Cepat** — Ringkasan analitik: IP tertinggi, IP terendah, rerata semester, dan persentase nilai A
- **Catatan & Refleksi Semester** — Tambah catatan belajar, *lesson learned*, dan tag kategori per semester
- **Achievements & Piagam** — Sistem medali dan pencapaian akademik otomatis berbasis progres studi
- **Share Card Visual** — Buat kartu ringkasan progres akademik yang dapat diunduh sebagai gambar
- **Export Transkrip** — Unduh transkrip nilai akademik lengkap dalam format teks
- **Dark Mode & Light Mode** — Tema visual modern yang dapat diganti kapan saja
- **Penyimpanan Lokal (Offline)** — Seluruh data tersimpan otomatis di `localStorage` browser tanpa perlu login/server

---

## 🎯 Tujuan Project

Mahasiswa sering kali hanya melihat IPK kumulatif di akhir semester tanpa memahami tren perkembangan akademik mereka dari waktu ke waktu. **Cek IPK** hadir untuk memberikan gambaran yang lebih terstruktur — mulai dari progres IP per semester, distribusi nilai, hingga prediksi IPK akhir — sehingga mahasiswa dapat mengambil tindakan yang lebih terarah.

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|---|---|
| HTML5 | Struktur antarmuka |
| CSS3 | Styling dan layout responsif |
| JavaScript (Vanilla) | Logika aplikasi dan interaktivitas |
| [Chart.js](https://www.chartjs.org/) | Visualisasi grafik dan tren |
| [Font Awesome 6](https://fontawesome.com/) | Ikon antarmuka |
| [html2canvas](https://html2canvas.hertzen.com/) | Ekspor share card sebagai gambar |
| LocalStorage | Penyimpanan data di browser |

---

## 📊 Cara Kerja

1. Pengguna menambahkan data semester baru.
2. Pengguna memasukkan mata kuliah beserta jumlah SKS dan nilai (A, A-, B+, dst.).
3. Sistem menghitung IP semester secara otomatis menggunakan bobot nilai × SKS.
4. Data tersimpan otomatis di `localStorage` browser.
5. Dashboard menampilkan IPK kumulatif terkini, grafik tren, dan statistik akademik secara real-time.
6. Pengguna dapat membuka visualisasi grafik lengkap, melihat pencapaian piagam, mengunduh transkrip nilai, atau membagikan kartu ringkasan akademik.

---

## 🚀 Cara Menjalankan

Project ini adalah aplikasi web statis — tidak memerlukan instalasi atau build step.

1. Clone repository:
   ```bash
   git clone https://github.com/username/CekIPK.git
   ```
2. Buka folder project.
3. Jalankan `index.html` langsung di browser, **atau** gunakan ekstensi **Live Server** di VS Code untuk pengalaman terbaik.

> **Catatan:** Karena menggunakan `localStorage`, data hanya tersimpan di browser yang sama. Membuka dari `file://` (tanpa server lokal) tetap berfungsi normal.

---

## 📁 Struktur Project

```text
CekIPK/
├── index.html   # Struktur antarmuka utama
├── script.js    # Seluruh logika aplikasi, kalkulasi, dan rendering
├── style.css    # Styling dan layout
└── README.md    # Dokumentasi project
```

---

## 📝 Lisensi

Project ini dibuat untuk keperluan pembelajaran. Silakan digunakan dan dimodifikasi sesuai kebutuhan.
