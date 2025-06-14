/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // activamos el modo oscuro por clase
  theme: {
    extend: {
      colors: {
       // Modo claro
        background: "#fefcf9",
        surface: "#ffffff",
        text: "#1a1a1a",
        border: "#e5e5e5",
        primary: "#8b5cf6",     
        secondary: "#c084fc",   
        danger: "#e53935",

        // Modo oscuro con prefijo "dark-"
        'dark-background': "#1a1b1f",
        'dark-surface': "#2c2c3b",
        'dark-text': "#e5e5e5",
        'dark-border': "#444458",
        'dark-primary': "#8b5cf6",
        'dark-secondary': "#c084fc",
        'dark-danger': "#f87171",
      },
    },
  },
  plugins: [],
}


