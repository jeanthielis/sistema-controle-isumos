/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151e2e', // Tom extra escuro para cabeçalhos
        },
        industrial: {
          orange: '#F97316', // Destaques e CTAs principais
          blue: '#0EA5E9',   // Informações secundárias
        }
      }
    },
  },
  plugins: [],
}
