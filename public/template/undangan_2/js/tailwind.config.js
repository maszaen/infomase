tailwind.config = {
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#727464',
          50: '#F4F5F2',
          100: '#E8E9E3',
          200: '#D2D4C8',
          300: '#B8BBA9',
          400: '#9AA087',
          500: '#7F8170',
          600: '#727464',
          700: '#5A5C4F',
          800: '#43453B',
          900: '#2C2D27',
        },
        mutedSage: {
          DEFAULT: '#7F8170',
          light: '#A1A392',
          dark: '#636556',
        },
        ivory: {
          DEFAULT: '#D8D3C5',
          50: '#FAF8F5',
          100: '#F5F2EC',
          200: '#ECE7DD',
          300: '#E0DACD',
          400: '#D8D3C5',
          500: '#C2BCAD',
          600: '#A39D8E',
        },
        charcoal: {
          DEFAULT: '#0C0D0C',
          50: '#F2F2F2',
          100: '#E0E1E0',
          800: '#1E1F1E',
          900: '#0C0D0C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
      }
    }
  }
};
