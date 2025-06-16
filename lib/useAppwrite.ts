// lib/useAppwrite.ts

import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

// Interface untuk opsi yang diterima oleh hook
interface UseAppwriteOptions<T, P extends Record<string, any>> {
  fn: (params: P) => Promise<T>; // Fungsi Appwrite yang akan dieksekusi
  params?: P; // Parameter untuk fungsi tersebut
  skip?: boolean; // Opsi untuk melewati eksekusi awal
}

// Interface untuk nilai yang dikembalikan oleh hook
interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

/**
 * Hook kustom untuk berinteraksi dengan layanan Appwrite secara konsisten.
 * Mengelola state untuk data, loading, dan error.
 * @param fn - Fungsi async dari layanan Appwrite yang akan dipanggil.
 * @param params - Parameter awal untuk fungsi tersebut.
 * @param skip - Jika true, tidak akan menjalankan fungsi saat komponen pertama kali render.
 */
export const useAppwrite = <T, P extends Record<string, any>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data, dibungkus dalam useCallback untuk efisiensi
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn] // Dependensi useCallback adalah fungsi 'fn'
  );

  // useEffect untuk menjalankan fetchData saat komponen pertama kali dimuat
  useEffect(() => {
    // Hanya berjalan jika tidak di-skip
    if (!skip) {
      fetchData(params).catch((err) => {
        // Menangani error yang mungkin tidak tertangkap di dalam fetchData
        console.error("Error dalam efek useAppwrite:", err);
        setLoading(false);
      });
    } else {
      // Jika di-skip, langsung set loading ke false
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, JSON.stringify(params)]); // Dependensi effect adalah skip dan parameter

  // Fungsi untuk memuat ulang data secara manual
  const refetch = async (newParams?: P) => {
    await fetchData(newParams || params);
  };

  return { data, loading, error, refetch };
};