tailwind.config = {
  theme: {
    extend: {
      colors: {
        // Luxury Classic Maroon & Gold Palette (Image 2)
        maroon: {
          DEFAULT: '#3B080D', // Deep Maroon - Background utama
          deep: '#3B080D',
          dark: '#21100F',
        },
        burgundy: {
          DEFAULT: '#5A1018', // Burgundy - Area konten utama
          light: '#790F25',
          deep: '#3B080D',
        },
        wine: {
          DEFAULT: '#790F25', // Royal Wine - Aksen merah
          dark: '#5A1018',
        },
        gold: {
          antique: '#C49A55', // Antique Gold - Ornamen dan garis dekorasi
          champagne: '#E8C995', // Champagne Gold - Tombol dan highlight
          DEFAULT: '#C49A55',
          light: '#F3DEB8',
          dark: '#A67C3B',
        },
        ivory: {
          cream: '#F5E8D8', // Ivory Cream - Teks dan elemen terang
          DEFAULT: '#F5E8D8',
          light: '#FAF5EE',
        },
        espresso: {
          DEFAULT: '#21100F', // Dark Espresso - Shadow dan background gelap
          dark: '#150809',
        },

        // Legacy compat
        ocean: {
          DEFAULT: '#284B56',
          dark: '#1E3942',
          light: '#366472',
          deep: '#1B3B47',
        },
        sand: {
          DEFAULT: '#D4A362',
          light: '#E2BA83',
          dark: '#B88645',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
      }
    }
  }
};
