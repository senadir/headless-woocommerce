import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_API,
  withCredentials: true,
});

export { instance as axios };
