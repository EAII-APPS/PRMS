/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
// import withMT from "@tw-elements/dist/plugin.cjs";


export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
    plugins: [
   
  ],
});


