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
        maha: {
          purple: '#7030A0', // Purple header from reference Sheet1
          darkPurple: '#532277',
          gold: '#C5A880',
          dark: '#1e293b',
          light: '#f8fafc',
        },
        status: {
          available: '#10b981', // green
          reserved: '#f59e0b',  // amber
          sold: '#ef4444',      // red
        },
      },
    },
  },
  plugins: [],
};

