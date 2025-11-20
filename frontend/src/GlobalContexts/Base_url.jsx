import axios from "axios";

const instance = axios.create({
  baseURL: "http://196.188.240.102:4020/",   
});

export default instance;
