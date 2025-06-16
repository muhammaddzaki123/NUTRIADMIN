interface Meal {
  bahan: string;
  berat: string;
  urt: string;
  penukar: string;
  exmenu : string
}

interface MealPlan {
  title: string;
  meals: {
    pagi: Meal[];
    selinganPagi?: Meal[];
    siang: Meal[];
    selinganSiang?: Meal[];
    malam: Meal[];
  };
}

interface DietPlansByCalories {
  [calories: number]: MealPlan;
}

interface DietPlans {
  [disease: string]: DietPlansByCalories;
}

export const DIET_PLANS: DietPlans = {
  Diabetes: {
    1100: {
      title: "Standar Diet Diabetes 1100 Kalori",
      meals: {
        pagi: [
        { bahan: "Karbohidrat", berat: "50 gram", urt: "1/2 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 hewani", exmenu: "Semur daging" },
        { bahan: "Sayuran A", berat: "55 gram", urt: "1/2 gls", penukar: "1/2 sayuran", exmenu: "Bening kelor" },
        { bahan: "Minyak", berat: "10 gram", urt: "1 sdt", penukar: "1 minyak", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "50 gram", urt: "1 ptg sdg", penukar: "1 Nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 Karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran", exmenu: "Bening labu siam" },
        { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "1 buah", exmenu: "Pepaya" }
      ]
      }
    },
    1300: {
      title: "Standar Diet Diabetes 1300 Kalori",
      meals: {
              pagi: [
        { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 hewani", exmenu: "Semur daging" },
        { bahan: "Sayuran A", berat: "55 gram", urt: "1/2 gls", penukar: "1/2 Sayuran", exmenu: "Bening kelor" },
        { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 minyak", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 Buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "50 gram", urt: "1 ptg sdg", penukar: "1 nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "10 gram", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran", exmenu: "Bening labu siam" },
        { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "1 ptg buah", exmenu: "Pepaya" }
      ]
      }
    },
    1500: {
      title: "Standar Diet Diabetes 1500 Kalori",
      meals: {
        pagi: [
        { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 Karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani", exmenu: "Semur daging" },
        { bahan: "Nabati", berat: "25 gram", urt: "1/2 ptg sdg", penukar: "1/2 nabati", exmenu: "Tempe kukus" },
        { bahan: "Sayuran A", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 Sayuran A", exmenu: "Bening kelor" },
        { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 Minyak", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 Buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 Sayur B", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "10 gram", urt: "2 sdt", penukar: "2 Minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 gram", urt: "1 bh", penukar: "1 Buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 Karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 Sayur B", exmenu: "Bening labu siam" },
        { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "1 Buah", exmenu: "Pepaya" }
      ]
      }
    },
    1700: {
      title: "Standar Diet Diabetes 1700 Kalori",
      meals: {
        pagi: [
        { bahan: "Nasi", berat: "100 g", urt: "1 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 g", urt: "1 ptg sedang", penukar: "1 hewani", exmenu: "Semur daging" },
        { bahan: "Nabati", berat: "55 g", urt: "1/2 bj sdg", penukar: "1/2 nabati", exmenu: "Tahu masak jamur" },
        { bahan: "Minyak", berat: "5 g", urt: "1 sdt", penukar: "1 minyak", exmenu: "Sup lobak + tomat" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 g", urt: "1 buah", penukar: "1 buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 g", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdng", penukar: "1 hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 g", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 g", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "150 g", urt: "1 1/2 gls", penukar: "1 1/2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 g", urt: "1 bj bsr", penukar: "1 nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Tumis buncis" },
        { bahan: "Buah", berat: "110 g", urt: "1 ptg bsr", penukar: "1 buah", exmenu: "Pepaya" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ]
      }
    },
    1900: {
      title: "Standar Diet Diabetes 1900 Kalori",
      meals: {
      pagi: [
        { bahan: "Karbohidrat", berat: "150 gram", urt: "1 1/2 gls", penukar: "1/2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani", exmenu: "Semur daging" },
        { bahan: "Nabati", berat: "25 gram", urt: "1/2 ptg sdg", penukar: "1/2 Nabati", exmenu: "Tempe kukus" },
        { bahan: "Sayuran A", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 Sayuran A", exmenu: "Bening kelor" },
        { bahan: "Minyak", berat: "10 gram", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 Buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati", exmenu: "Tahu Goreng" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 Sayur B", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "20 gram", urt: "2 sdt", penukar: "minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 gram", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "sayur b", exmenu: "Bening labu siam" },
        { bahan: "Buah", berat: "110 gram", urt: "2 ptg bsr", penukar: "ptg buah", exmenu: "Pepaya" }
      ]
      }
    },
    2100: {
      title: "Standar Diet Diabetes 2100 Kalori",
      meals: {
         pagi: [
        { bahan: "Nasi", berat: "100 g", urt: "1 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 g", urt: "1 ptg sedang", penukar: "1 hewani", exmenu: "Semur daging" },
        { bahan: "Nabati", berat: "55 g", urt: "1/2 bj sdg", penukar: "1/2 nabati", exmenu: "Tahu masak jamur" },
        { bahan: "Minyak", berat: "5 g", urt: "1 sdt", penukar: "1 minyak", exmenu: "Sup lobak + tomat" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 g", urt: "1 buah", penukar: "1 buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 g", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdng", penukar: "1 hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 g", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 g", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "150 g", urt: "1 1/2 gls", penukar: "1 1/2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 g", urt: "1 bj bsr", penukar: "1 nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Tumis buncis" },
        { bahan: "Buah", berat: "110 g", urt: "1 ptg bsr", penukar: "1 buah", exmenu: "Pepaya" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ]
      }
    },

    2500 : {
      title : "Standar Diet Diabetes 2500 Kalori",
      meals: {
         pagi: [
        { bahan: "Nasi", berat: "100 g", urt: "1 gls", penukar: "1 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "35 g", urt: "1 ptg sedang", penukar: "1 hewani", exmenu: "Semur daging" },
        { bahan: "Nabati", berat: "55 g", urt: "1/2 bj sdg", penukar: "1/2 nabati", exmenu: "Tahu masak jamur" },
        { bahan: "Minyak", berat: "5 g", urt: "1 sdt", penukar: "1 minyak", exmenu: "Sup lobak + tomat" }
      ],
      selinganPagi: [
        { bahan: "Buah", berat: "90 g", urt: "1 buah", penukar: "1 buah", exmenu: "Jus mangga" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "200 g", urt: "2 gls", penukar: "2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdng", penukar: "1 hewani", exmenu: "Ikan Goreng" },
        { bahan: "Nabati", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati", exmenu: "Tempe Goreng" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Sayur asem" },
        { bahan: "Buah", berat: "110 g", urt: "1 bh", penukar: "1 buah", exmenu: "Jeruk" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Buah", berat: "50 g", urt: "1 bh", penukar: "1 buah", exmenu: "Pisang" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "150 g", urt: "1 1/2 gls", penukar: "1 1/2 karbohidrat", exmenu: "Nasi" },
        { bahan: "Hewani", berat: "40 g", urt: "1 ptg sdg", penukar: "1 hewani", exmenu: "Botok ayam" },
        { bahan: "Nabati", berat: "110 g", urt: "1 bj bsr", penukar: "1 nabati", exmenu: "Pepes tahu" },
        { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran", exmenu: "Tumis buncis" },
        { bahan: "Buah", berat: "110 g", urt: "1 ptg bsr", penukar: "1 buah", exmenu: "Pepaya" },
        { bahan: "Minyak", berat: "10 g", urt: "2 sdt", penukar: "2 minyak", exmenu: "Minyak" }
      ]
      }
    },
  },

  Hipertensi: {
    1700: {
      title: "Standar Diet Hipertensi 1700 Kalori",
      meals: {
        pagi: [
        { bahan: "Oat", berat: "25 g", penukar: "1", urt: "1,5 sdm", exmenu: "Oatmeal dengan susu" },
        { bahan: "Susu low fat", berat: "150 ml", penukar: "1", urt: "1/8 gls", exmenu: "Susu low fat" },
        { bahan: "Buah (pisang)", berat: "100 g", penukar: "1", urt: "1 bh", exmenu: "Pisang" },
        { bahan: "Telur", berat: "55 g", penukar: "1", urt: "1 bh", exmenu: "Orak arik telur" },
        { bahan: "Sayur", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Tumis sayur" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Kacang hijau", berat: "20 g", penukar: "1", urt: "2 sdm", exmenu: "Bubur kacang hijau" },
        { bahan: "Gula pasir", berat: "5 g", penukar: "1", urt: "1/2 sdm", exmenu: "Gula pasir" }
      ],
      siang: [
        { bahan: "Beras", berat: "50 g", penukar: "1", urt: "1 gls", exmenu: "Nasi putih" },
        { bahan: "Sayuran", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Sayur bening" },
        { bahan: "Ikan", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Pepes ikan" },
        { bahan: "Tempe", berat: "50 g", penukar: "1", urt: "2 ptg sdg", exmenu: "Tumis tempe" },
        { bahan: "Buah (melon)", berat: "100 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Melon" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "0,5 sdt", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Apel", berat: "100 g", penukar: "1", urt: "1 bh", exmenu: "Jus apel" },
        { bahan: "Gula", berat: "5 g", penukar: "1", urt: "0,5 sdt", exmenu: "Gula" }
      ],
      malam: [
        { bahan: "Beras", berat: "50 g", penukar: "1", urt: "1 gls", exmenu: "Nasi" },
        { bahan: "Sayuran", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Sayur bening" },
        { bahan: "Daging", berat: "40 g", penukar: "1", urt: "1 ptg kcl", exmenu: "Tumis daging + tahu orak arik" },
        { bahan: "Tahu", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tahu" },
        { bahan: "Susu low fat", berat: "150 ml", penukar: "1.5", urt: "1/8 gls", exmenu: "Susu low fat" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ]
      }
    },
    1900: {
      title: "Standar Diet Hipertensi 1900 Kalori",
      meals: {
        pagi: [
        { bahan: "Oat", berat: "30 g", penukar: "1", urt: "1,5 sdm", exmenu: "Oatmeal dengan susu" },
        { bahan: "Susu low fat", berat: "180 ml", penukar: "1", urt: "1 gls", exmenu: "Susu low fat" },
        { bahan: "Buah (pisang)", berat: "100 g", penukar: "1", urt: "1 bh", exmenu: "Pisang" },
        { bahan: "Telur", berat: "55 g", penukar: "1", urt: "1 bh", exmenu: "Orak arik telur" },
        { bahan: "Sayur", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Tumis sayur" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Kacang hijau", berat: "20 g", penukar: "1", urt: "2 sdm", exmenu: "Bubur kacang hijau" },
        { bahan: "Gula pasir", berat: "10 g", penukar: "1", urt: "1 sdm", exmenu: "Gula pasir" }
      ],
      siang: [
        { bahan: "Beras", berat: "60 g", penukar: "1", urt: "1,1 gls", exmenu: "Nasi putih" },
        { bahan: "Sayuran", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Sayur bening" },
        { bahan: "Ikan", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Pepes ikan" },
        { bahan: "Tempe", berat: "50 g", penukar: "1", urt: "2 ptg sdg", exmenu: "Tumis tempe" },
        { bahan: "Buah (melon)", berat: "100 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Melon" },
        { bahan: "Minyak", berat: "7 g", penukar: "1", urt: "0,7 sdt", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Jus apel", berat: "150 g", penukar: "1.5", urt: "1 bh sdg", exmenu: "Jus apel" },
        { bahan: "Gula", berat: "7 g", penukar: "1", urt: "0,7 sdt", exmenu: "Gula" }
      ],
      malam: [
        { bahan: "Nasi", berat: "60 g", penukar: "1", urt: "1,2 gls", exmenu: "Nasi" },
        { bahan: "Sayuran", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Sayur bening" },
        { bahan: "Daging", berat: "40 g", penukar: "1", urt: "1 ptg kcl", exmenu: "Tumis daging + tahu orak arik" },
        { bahan: "Tahu", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tahu" },
        { bahan: "Susu low fat", berat: "200 ml", penukar: "2", urt: "1 gls", exmenu: "Susu low fat" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ]
      }
    },
    2100: {
      title: "Standar Diet Hipertensi 2100 Kalori",
      meals: {
      pagi: [
        { bahan: "Oat", berat: "40 g", penukar: "1", urt: "2 sdm", exmenu: "Oatmeal dengan susu" },
        { bahan: "Susu low fat", berat: "200 ml", penukar: "2", urt: "1 gls", exmenu: "Susu low fat" },
        { bahan: "Buah (pisang)", berat: "110 g", penukar: "1", urt: "1 bh", exmenu: "Pisang" },
        { bahan: "Telur", berat: "60 g", penukar: "1", urt: "1 bh", exmenu: "Orak arik telur" },
        { bahan: "Sayur", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Tumis sayur" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Kacang hijau", berat: "25 g", penukar: "1", urt: "2 sdm", exmenu: "Bubur kacang hijau" },
        { bahan: "Gula pasir", berat: "15 g", penukar: "1.5", urt: "1,5 sdm", exmenu: "Gula pasir" }
      ],
      siang: [
        { bahan: "Beras", berat: "75 g", penukar: "1.5", urt: "1,25 gls", exmenu: "Nasi putih" },
        { bahan: "Sayuran", berat: "150 g", penukar: "1", urt: "1,5 gls", exmenu: "Sayur bening" },
        { bahan: "Ikan", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Pepes ikan" },
        { bahan: "Tempe", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tumis tempe" },
        { bahan: "Buah (melon)", berat: "100 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Melon" },
        { bahan: "Minyak", berat: "10 g", penukar: "2", urt: "1 sdt", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Jus apel", berat: "200 g", penukar: "2", urt: "1 bh bsr", exmenu: "Jus apel" },
        { bahan: "Gula", berat: "10 g", penukar: "2", urt: "1 sdm", exmenu: "Gula" }
      ],
      malam: [
        { bahan: "Nasi", berat: "75 g", penukar: "1.5", urt: "1,25 gls", exmenu: "Nasi" },
        { bahan: "Sayuran", berat: "150 g", penukar: "1.5", urt: "1,5 gls", exmenu: "Sayur bening" },
        { bahan: "Daging", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tumis daging + tahu orak arik" },
        { bahan: "Tahu", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tahu" },
        { bahan: "Susu low fat", berat: "200 ml", penukar: "2", urt: "1 gls", exmenu: "Susu low fat" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ]
      }
    },
    2300: {
      title: "Standar Diet Hipertensi 2300 Kalori",
      meals: {
      pagi: [
        { bahan: "Oat", berat: "50 g", penukar: "1", urt: "2 sdm", exmenu: "Oatmeal dengan susu" },
        { bahan: "Susu low fat", berat: "250 ml", penukar: "2.5", urt: "1,5 gls", exmenu: "Susu low fat" },
        { bahan: "Buah (pisang)", berat: "120 g", penukar: "1.2", urt: "1 bh", exmenu: "Pisang" },
        { bahan: "Telur", berat: "60 g", penukar: "1", urt: "1 bh", exmenu: "Orak arik telur" },
        { bahan: "Sayur", berat: "100 g", penukar: "1", urt: "1 gls", exmenu: "Tumis sayur" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ],
      selinganPagi: [
        { bahan: "Kacang hijau", berat: "30 g", penukar: "1", urt: "3 sdm", exmenu: "Bubur kacang hijau" },
        { bahan: "Gula pasir", berat: "15 g", penukar: "1.5", urt: "1,5 sdm", exmenu: "Gula pasir" }
      ],
      siang: [
        { bahan: "Beras", berat: "80 g", penukar: "1.8", urt: "1,3 gls", exmenu: "Nasi putih" },
        { bahan: "Sayuran", berat: "150 g", penukar: "1.6", urt: "1,5 gls", exmenu: "Sayur bening" },
        { bahan: "Ikan", berat: "60 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Pepes ikan" },
        { bahan: "Tempe", berat: "60 g", penukar: "1", urt: "2 ptg sdg", exmenu: "Tumis tempe" },
        { bahan: "Buah (melon)", berat: "120 g", penukar: "1.2", urt: "1,2 ptg sdg", exmenu: "Melon" },
        { bahan: "Minyak", berat: "12 g", penukar: "2", urt: "1,2 sdt", exmenu: "Minyak" }
      ],
      selinganSiang: [
        { bahan: "Jus apel", berat: "200 g", penukar: "2", urt: "1 bh bsr", exmenu: "Jus apel" },
        { bahan: "Gula", berat: "12 g", penukar: "2", urt: "1,2 sdt", exmenu: "Gula" }
      ],
      malam: [
        { bahan: "Nasi", berat: "80 g", penukar: "1.5", urt: "1,3 gls", exmenu: "Nasi" },
        { bahan: "Sayuran", berat: "150 g", penukar: "1.5", urt: "1,5 gls", exmenu: "Sayur bening" },
        { bahan: "Daging", berat: "50 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tumis daging + tahu orak arik" },
        { bahan: "Tahu", berat: "60 g", penukar: "1", urt: "1 ptg sdg", exmenu: "Tahu" },
        { bahan: "Susu low fat", berat: "250 ml", penukar: "2.5", urt: "1,5 gls", exmenu: "Susu low fat" },
        { bahan: "Minyak", berat: "5 g", penukar: "1", urt: "1 sdt", exmenu: "Minyak" }
      ]
      }
    },
  },

  Kanker: {
    1700: {
      title: "Standar Diet Kanker 1700 Kalori",
      meals: {
        pagi: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "75", urt: "1 potong sedang", penukar: "1 1/2", exmenu: "Sup daging" },
        { bahan: "Protein Nabati", berat: "30", urt: "2 sdm", penukar: "1", exmenu: "Orek Tempe" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Tumis Kacang Panjang" },
        { bahan: "Buah Segar", berat: "50", urt: "1 bh", penukar: "1", exmenu: "Buah Pisang" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
        selinganPagi: [
        { bahan: "Selingan", berat: "150", urt: "1 mangkok", penukar: "1", exmenu: "Bubur sum-sum" }
      ],
        siang: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "75", urt: "1 potong sedang", penukar: "1 1/2", exmenu: "Tim Ikan" },
        { bahan: "Protein Nabati", berat: "40", urt: "1 potong sdg", penukar: "1", exmenu: "Pepes Tahu" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Sayur Sop" },
        { bahan: "Buah Segar", berat: "100", urt: "2 ptg sdg", penukar: "1", exmenu: "Buah Pepaya" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "75", urt: "1 btr", penukar: "1 1/2", exmenu: "Telur Opor" },
        { bahan: "Protein Nabati", berat: "40", urt: "1 potong sdg", penukar: "1", exmenu: "Tahu Kukus" },
        { bahan: "Sayuran", berat: "15", urt: "1 sndk sayur", penukar: "1", exmenu: "Sayur Bening bayam" },
        { bahan: "Buah Segar", berat: "200", urt: "2 ptg sdg", penukar: "1", exmenu: "Buah Semangka" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ]
      }
    },
    1900: {
      title: "Standar Diet Kanker 1900 Kalori",
      meals: {
          pagi: [
          { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
          { bahan: "Protein hewani", berat: "75", urt: "1 potong sedang", penukar: "1 1/2", exmenu: "Ayam Ungkep" },
          { bahan: "Protein Nabati", berat: "80", urt: "2 potong sdg", penukar: "1", exmenu: "Tahu Kukus" },
          { bahan: "Sayuran", berat: "15", urt: "1 sndk sayur", penukar: "1", exmenu: "Sayur Bening" },
          { bahan: "Buah Segar", berat: "50", urt: "1 bh", penukar: "1", exmenu: "Buah Pisang" },
          { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
        ],
        selinganPagi: [
          { bahan: "Selingan", berat: "50", urt: "1 cup sdg", penukar: "1", exmenu: "Puding" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
          { bahan: "Protein hewani", berat: "75", urt: "1 potong sedang", penukar: "1 1/2", exmenu: "Ikan kuah kuning" },
          { bahan: "Protein Nabati", berat: "50", urt: "1 potong sdg", penukar: "1", exmenu: "Perkedel Tahu" },
          { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Tumis Kangkung" },
          { bahan: "Buah Segar", berat: "100", urt: "2 bh", penukar: "1", exmenu: "Buah Apel" },
          { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
        ],
        selinganSiang: [
          { bahan: "Selingan", berat: "250", urt: "1 gelas", penukar: "1", exmenu: "Jus buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
          { bahan: "Protein hewani", berat: "75", urt: "1 btr", penukar: "1 1/2", exmenu: "Telur dadar" },
          { bahan: "Protein Nabati", berat: "50", urt: "2 potong sdg", penukar: "1", exmenu: "Tempe Bacem" },
          { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Capcay" },
          { bahan: "Buah Segar", berat: "200", urt: "2 ptg sdg", penukar: "1", exmenu: "Buah Semangka" },
          { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
        ]
      }
    },
    2100: {
      title: "Standar Diet Kanker 2100 Kalori",
      meals: {
        pagi: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "50", urt: "1 btr", penukar: "1", exmenu: "Telur Rebus" },
        { bahan: "Protein Nabati", berat: "50", urt: "2 ptg sdg", penukar: "2", exmenu: "Tempe Ungkep" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Cah wortel jamur" },
        { bahan: "Buah Segar", berat: "50", urt: "1 bh", penukar: "1", exmenu: "Buah Jeruk" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
      selinganPagi: [
        { bahan: "Selingan", berat: "75", urt: "1 bh", penukar: "1", exmenu: "Roti manis" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "100", urt: "2 potong sedang", penukar: "1 1/2", exmenu: "Rolade Ayam" },
        { bahan: "Protein Nabati", berat: "40", urt: "1 potong sdg", penukar: "1", exmenu: "Tahu bacem" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Tumis sawi" },
        { bahan: "Buah Segar", berat: "100", urt: "1 bh", penukar: "1", exmenu: "Buah Apel" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
      selinganSiang: [
        { bahan: "Selingan", berat: "20", urt: "1 ptg sdg", penukar: "1", exmenu: "Bolu" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "75", urt: "1 ptg sdg", penukar: "1 1/2", exmenu: "Ikan asam manis" },
        { bahan: "Protein Nabati", berat: "50", urt: "1 sndk sayur", penukar: "1", exmenu: "Sup bening tahu" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Tumis buncis wortel" },
        { bahan: "Buah Segar", berat: "50", urt: "2 ptg sdg", penukar: "1", exmenu: "Buah Semangka" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ]
      }
    },
    2300: {
      title: "Standar Diet Kanker 2300 Kalori",
      meals: {
        pagi: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "50", urt: "1 btr", penukar: "1", exmenu: "Telur Dadar" },
        { bahan: "Protein Nabati", berat: "50", urt: "2 potong sdg", penukar: "1", exmenu: "Tempe ungkep" },
        { bahan: "Sayuran", berat: "30", urt: "2 sdm", penukar: "1", exmenu: "Oseng buncis" },
        { bahan: "Buah Segar", berat: "50", urt: "1 bh", penukar: "1", exmenu: "Buah Jeruk" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
      selinganPagi: [
        { bahan: "Selingan", berat: "75", urt: "1 bh", penukar: "1", exmenu: "Bubur kacang hijau" }
      ],
      siang: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "100", urt: "2 potong sedang", penukar: "1 1/2", exmenu: "Ayam balado" },
        { bahan: "Protein Nabati", berat: "40", urt: "1 potong sdg", penukar: "1", exmenu: "Tahu saus tomat" },
        { bahan: "Sayuran", berat: "30", urt: "1 sndk sayur", penukar: "1", exmenu: "Sayur sop" },
        { bahan: "Buah Segar", berat: "100", urt: "2 ptg sdg", penukar: "1", exmenu: "Buah pepaya" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ],
      selinganSiang: [
        { bahan: "Selingan", berat: "95", urt: "1 cup", penukar: "1", exmenu: "Salad buah" }
      ],
      malam: [
        { bahan: "Karbohidrat", berat: "75", urt: "1 sdk nasi", penukar: "1 1/2", exmenu: "Nasi" },
        { bahan: "Protein hewani", berat: "75", urt: "1 ptg sdg", penukar: "1 1/2", exmenu: "Semur daging" },
        { bahan: "Protein Nabati", berat: "50", urt: "2 potong sdg", penukar: "1", exmenu: "Tempe manis" },
        { bahan: "Sayuran", berat: "15", urt: "1 sndk sayur", penukar: "1", exmenu: "Sayur bening kelor" },
        { bahan: "Buah Segar", berat: "50", urt: "1 bh", penukar: "1", exmenu: "Buah pisang" },
        { bahan: "Air Mineral", berat: "600", urt: "1 btl", penukar: "1", exmenu: "Air mineral" }
      ]
      }
    }
  }


};
