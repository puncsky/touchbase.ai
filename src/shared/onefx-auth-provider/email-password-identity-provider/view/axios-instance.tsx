import axios from "axios";
import { csrfToken } from "../../../common/browser-state";

export const axiosInstance = axios.create({
  timeout: 10000,
  headers: { "x-csrf-token": csrfToken }
});
