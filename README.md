# Cek IPK

**Cek IPK** adalah aplikasi web untuk membantu mahasiswa mencatat dan memantau perkembangan Indeks Prestasi Kumulatif (IPK) berdasarkan semester. Seluruh data tersimpan secara lokal di browser sehingga tidak memerlukan akun atau koneksi internet khusus.

---

## ✨ Fitur

- **Perhitungan IPK & IP Semester** — Kalkulasi otomatis berdasarkan nilai dan SKS setiap mata kuliah
- **Pengelolaan Semester** — Tambah, hapus, dan kelola data per semester secara terstruktur
- **Pengelolaan Mata Kuliah** — Tambah, edit, dan hapus mata kuliah beserta nilai dan jumlah SKS
- **Grafik Perkembangan IPK** — Visualisasi tren IPK antar-semester menggunakan Chart.js, langsung di dashboard
- **Grafik Detail** — Modal visualisasi tambahan berisi grafik IP semester, distribusi nilai, dan tren SKS
- **Statistik Akademik** — Ringkasan cepat: total SKS, mata kuliah terbaik, mata kuliah terendah, dan tren terkini
- **Analisis AI per Semester** — Analisis otomatis berbasis data untuk setiap semester
- **Analisis AI Keseluruhan** — Ringkasan akademik menyeluruh, prediksi IPK akhir, dan rekomendasi
- **Catatan Semester** — Tambah catatan, *lesson learned*, dan tag per semester
- **Achievements** — Sistem pencapaian & medali berdasarkan progres akademik
- **Share Card** — Buat kartu ringkasan akademik yang dapat dibagikan sebagai gambar
- **Export PDF** — Unduh transkrip akademik dalam format PDF
- **Dark Mode** — Tampilan gelap yang dapat diaktifkan kapan saja
- **Penyimpanan Lokal** — Semua data tersimpan di `localStorage` browser, tanpa server

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
6. Pengguna dapat melihat analisis AI, membuka grafik detail, mengunduh transkrip PDF, atau membagikan kartu ringkasan akademik.

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
