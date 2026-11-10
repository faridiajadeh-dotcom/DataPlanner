# 💌 Date Planner & Love Letter Interactive System

Sistem interaktif **Date Planner & Love Letter** yang terinspirasi dari video TikTok viral (@irfanlukman.id). Sistem ini dirancang khusus untuk mengajak pasangan / gebetan kencan dengan cara yang sangat manis, seru, dan berkesan!

---

## ✨ Fitur-Fitur Utama

1. **Stage 1: Cupid's Bow & Arrow Mini-Game (Aim & Shoot)**
   - Amplop surat cinta mengambang lembut dengan efek *parallax* gerakan kursor/layar.
   - Busur panah Cupid interaktif: kamu bisa menarik tali busur ke bawah (mouse drag / touch) lalu melepaskannya untuk menembakkan panah cinta tepat ke segel hati amplop.
   - Animasi amplop terbuka dengan efek partikel hati dan transisi mulus ke jendela berikutnya.

2. **Stage 2: Retro "PLEASE" Window & Runaway "NO" Button**
   - Jendela bergaya retro OS dengan bingkai bermotif *pink gingham* (kotak-kotak piknik manis).
   - Animasi **Pixel Art Kucing Hitam 8-bit** memegang hati merah yang berkedip dan memantul gembira.
   - Pertanyaan: *"Mau jalan-jalan bareng aku ga?"*
   - Tombol **NO** yang jahil: tombol ini akan kabur / melarikan diri setiap kali didekati atau disentuh kursor!
   - Tombol **YES**: memicu ledakan konfeti warna-warni, kucing berubah sangat bahagia (`^ ^`), dan muncul pesan cinta serta tombol *"Lanjut →"*.

3. **Stage 3: Date Planner Multi-Step Flow**
   - **Langkah 1 (Tanggal & Waktu):**
     - Memilih tanggal kencan dengan kalender interaktif berbahasa Indonesia (contoh: *Sabtu, 27 Juni 2026*).
     - *Chips* waktu: `Pagi`, `Siang`, `Sore`, `Malam`.
     - *Time picker* interaktif untuk memilih jam & menit (contoh: *17:00*).
   - **Langkah 2 (Rencana Aktivitas):**
     - Pilihan aktivitas (multi-select) lengkap dengan ikon lucu: `Makan Malam 🍽️`, `Nonton Film 🎬`, `Jalan-Jalan 📍`, `Main Game 🎮`, `Belanja 🛍️`, `Ngopi Bareng ☕`, `Melukis 🎨`, `Konser 🎵`.
     - Kolom teks bebas untuk menulis ide aktivitas kencan impian kalian sendiri.
   - **Langkah 3 (Dress Code):**
     - Pilihan gaya pakaian: `Casual`, `Semi-Formal`, `Couple Outfit`, `Formal`, `Bebas`, serta kolom input khusus.
   - **Langkah 4 (Pesan Khusus):**
     - Kolom catatan cinta / pesan manis untuk pasangan sebelum membuat tiket.

4. **Stage 4: Boarding Pass "Tiket Kencan" (Admit Two)**
   - Kartu tiket bergaya retro elegan dengan perforasi gerigi di samping dan garis putus-putus.
   - Menampilkan ringkasan lengkap: `UNTUK`, `KAPAN`, `ACARA`, `DRESS CODE`, dan `PESAN`.
   - **Tombol "Bagikan tiket":** Otomatis membuat dan mengunduh gambar resolusi tinggi (PNG) tiket kencan langsung ke perangkatmu!
   - **Tombol "Chat WhatsApp":** Membuka WhatsApp secara langsung dengan teks format rapi berisikan detail tiket kencan untuk dikirim ke pasanganmu.

5. **Stage 5: Pengaturan Kustomisasi & Salin Link**
   - Tombol roda gigi ⚙️ di pojok kanan atas untuk mengubah:
     - Nama Pengirim (default: `Ahmad Paridi`)
     - Nama Penerima (default: `Titisan Ilahi`)
     - Nomor WhatsApp tujuan (default: `081281278846`)
   - Tombol **"Salin Link"**: Otomatis menyalin URL yang telah terpasang nama kamu & pasanganmu (`?from=...&to=...&phone=...`) sehingga bisa langsung dikirim ke pasanganmu tanpa perlu setting ulang!

6. **Web Audio Synthesizer (Tanpa file audio eksternal)**
   - Efek suara desingan panah Cupid, denting pop amplop, suara klik lembut, dan fanfare kegembiraan saat memilih YES!
   - Tombol toggle mute/unmute suara 🔔 di pojok kanan atas.

---

## 🚀 Cara Menjalankan

Cukup buka file `index.html` langsung di browser favoritmu (Google Chrome, Edge, Safari, Firefox) di PC, Laptop, Tablet, maupun HP.

Atau jika ingin menjalankan lewat local server:
```bash
python -m http.server 3000
```
Lalu buka di browser: `http://localhost:3000`

---

## 📁 Struktur File

- `index.html` : Struktur halaman utama, tata letak amplop, busur panah, jendela retro, wizard perencana tanggal, tiket kencan, dan modal pengaturan.
- `love.css` : Desain visual, pola pink gingham, animasi amplop, busur panah, tiket kencan, dan responsivitas untuk HP & laptop.
- `love.js` : Logika interaksi busur panah, rendering animasi kucing pixel art 8-bit, tombol NO yang kabur, sistem konfeti, kalender Indonesia, generator gambar tiket via Canvas, integrasi link WhatsApp, serta efek audio sintesis.

