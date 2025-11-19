import axios from "axios";

const instance = axios.create({
  baseURL: "http://172.18.6.64/api",
});

export default instance;
