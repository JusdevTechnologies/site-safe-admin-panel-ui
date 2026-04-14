/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        header: '#0F172A',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#D97706',
        background: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
