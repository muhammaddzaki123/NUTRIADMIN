// utils/date.ts

// Daftar pola waktu relatif untuk mendeteksi string yang sudah diformat
const relativeTimePatterns = [
  /^Baru saja$/,
  /^\d+ menit yang lalu$/,
  /^\d+ jam yang lalu$/,
  /^\d+ hari yang lalu$/
];

// Periksa apakah string sudah dalam format waktu relatif
const isRelativeTimeFormat = (text: string): boolean => {
  return relativeTimePatterns.some(pattern => pattern.test(text));
};

export const formatTimestamp = (timestamp: string | number | Date): string => {
  try {
    let date: Date;
    
    // Tangani objek Date
    if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Tangani stempel waktu string
    else if (typeof timestamp === 'string') {
      // Periksa apakah sudah dalam format waktu relatif
      const cleanTimestamp = timestamp.trim();
      if (isRelativeTimeFormat(cleanTimestamp)) {
        return cleanTimestamp; // Kembalikan apa adanya jika sudah diformat
      }

      // Coba parsing sebagai string ISO
      date = new Date(cleanTimestamp);
      
      // Validasi tanggal yang sudah di-parse
      if (isNaN(date.getTime())) {
        throw new Error('Invalid ISO string format');
      }
    }
    // Tangani stempel waktu numerik (fallback)
    else if (typeof timestamp === 'number') {
      // Asumsikan milidetik untuk konsistensi dengan parsing string ISO
      date = new Date(timestamp);
      
      // Validasi tanggal yang sudah di-parse
      if (isNaN(date.getTime())) {
        throw new Error('Invalid numeric timestamp');
      }
    }
    // Tangani input yang tidak valid
    else {
      throw new Error('Invalid timestamp type');
    }

    // Validasi akhir
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date object created');
    }

    // --- PERBAIKAN DIMULAI DI SINI ---
    // Logika penyesuaian zona waktu manual yang salah telah dihapus.
    // Sekarang kita langsung menggunakan objek 'date' yang sudah benar
    // karena objek Date JavaScript secara otomatis menangani zona waktu.

    const now = new Date();
    // Hitung selisih waktu dalam menit secara langsung
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    // Gunakan waktu relatif untuk notifikasi baru
    if (diffInMinutes < 1) {
      return 'Baru saja';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) { // Kurang dari 24 jam
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else if (diffInMinutes < 10080) { // Kurang dari 7 hari
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} hari yang lalu`;
    }

    // Untuk notifikasi yang lebih lama, gunakan format tanggal lengkap
    // Ini akan secara otomatis menggunakan zona waktu lokal perangkat
    const formatter = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Gunakan format 24 jam
    });

    // Gunakan objek 'date' yang asli untuk pemformatan
    return formatter.format(date);
    // --- PERBAIKAN SELESAI ---

  } catch (error) {
    console.error('Error formatting timestamp:', {
      error: (error as Error).message,
      timestamp,
      type: typeof timestamp,
      originalValue: timestamp
    });
    
    // Kembalikan string yang lebih informatif daripada tanggal saat ini
    return 'Format waktu tidak valid';
  }
};