/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'Expo Arabic', 'sans-serif'],
        sans: ['Cairo', 'Expo Arabic', 'sans-serif'],
      },
      colors: {
        // Emerald & Sand Premium Real Estate Palette
        brand: {
          primary: '#126B58',    // Emerald Green
          dark: '#174A40',       // Deep Forest
          hover: '#0D5143',      // Dark Emerald
          secondary: '#71998A',  // Sage Green
          soft: '#E5EEE9',       // Soft Sage
        },
        sand: {
          gold: '#B89A68',       // Sand Gold
          champagne: '#D8C5A0',  // Light Champagne
          warm: '#F5F1E8',       // Warm Sand
          ivory: '#FAF9F5',      // Soft Ivory
        },
        surface: {
          main: '#FAF9F5',
          warm: '#F5F1E8',
          card: '#FFFFFF',
        },
        slateText: {
          primary: '#293B36',    // Dark Slate
          secondary: '#718078',  // Muted Slate
        },
        borderGray: '#E5E9E5',
        status: {
          available: '#126B58',  // Emerald for available
          reserved: '#B89A68',   // Sand Gold for reserved
          sold: '#D9534F',       // Soft elegant red for sold
        },
      },
    },
  },
  plugins: [],
};
