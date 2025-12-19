import axios from "axios";

const instance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_BASE_URL,
=======
  baseURL: "http://127.0.0.1:8000/api",
>>>>>>> origin/hot-fix/summmary-filter-and-reportgeneration-order
});

export default instance;
