/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
// import withMT from "@tw-elements/dist/plugin.cjs";


export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
    plugins: [
   
  ],
});