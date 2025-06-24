/**
 * Mengubah string enum (misal: "diabetes_melitus") menjadi format judul yang mudah dibaca (misal: "Diabetes Melitus").
 * @param text - Teks yang akan diformat.
 * @returns Teks yang sudah diformat, atau string kosong jika input tidak valid.
 */
export const formatDiseaseName = (text?: string | null): string => {
  if (!text) {
    return '';
  }

  return text
    .replace(/_/g, ' ') // Ganti semua underscore (_) dengan spasi
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
    .join(' ');
};