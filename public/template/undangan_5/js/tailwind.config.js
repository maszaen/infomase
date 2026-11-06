tailwind.config = {
  theme: {
    extend: {
      colors: {
        mountain: {
          DEFAULT: '#1E352B',
          dark: '#13251E',
          light: '#2E4F42',
          deep: '#0F1D17',
        },
        pine: {
          DEFAULT: '#36594B',
          dark: '#244135',
          light: '#4A7463',
          emerald: '#274E40',
        },
        cedar: {
          DEFAULT: '#C59A45',
          light: '#DBB66D',
          dark: '#A67C2C',
        },
        mist: {
          DEFAULT: '#E8EDE7',
          light: '#F3F6F2',
          dark: '#D4DDD3',
        },
        // Backwards-compatible theme aliases mapped to Mountain Alpine Palette
        ocean: {
          DEFAULT: '#1E352B',
          dark: '#13251E',
          light: '#2E4F42',
          deep: '#152A22',
        },
        palm: {
          DEFAULT: '#3E6655',
          dark: '#2B4A3D',
          light: '#53826E',
        },
        sand: {
          DEFAULT: '#C59A45',
          light: '#DBB66D',
          dark: '#A67C2C',
        },
        shell: {
          DEFAULT: '#F7F8F3',
          dark: '#EDF1E9',
        },
        sage: {
          DEFAULT: '#5A7266',
          50: '#F4F7F4',
          100: '#E7EDE8',
          200: '#D2DDD4',
          300: '#B6C7B9',
          400: '#8FA894',
          500: '#6B8A73',
          600: '#55705D',
          700: '#425849',
          800: '#2E3D33',
          900: '#1B241E',
        },
        mutedSage: {
          DEFAULT: '#6B8577',
          light: '#8FA79A',
          dark: '#4C6356',
        },
        ivory: {
          DEFAULT: '#E2E8DF',
          50: '#F9FAF7',
          100: '#F2F5F0',
          200: '#E6ECE3',
          300: '#D8E1D4',
          400: '#C7D3C2',
          500: '#B0BEAB',
          600: '#94A38F',
        },
        charcoal: {
          DEFAULT: '#0F1714',
          50: '#F4F5F4',
          100: '#E4E7E5',
          800: '#1B2420',
          900: '#0F1714',
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
