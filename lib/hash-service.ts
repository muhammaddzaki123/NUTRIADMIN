// lib/hash-service.ts

import { SHA256 } from 'crypto-js';

/**
 * Meng-hash string (password) menggunakan algoritma SHA-256.
 * @param plainTextPassword - Kata sandi dalam bentuk teks biasa.
 * @returns String hash dalam format heksadesimal.
 */
export function hashPassword(plainTextPassword: string): string {
  if (!plainTextPassword) {
    throw new Error("Password tidak boleh kosong untuk di-hash.");
  }
  // Menghasilkan objek hash dan mengubahnya menjadi string
  return SHA256(plainTextPassword).toString();
}