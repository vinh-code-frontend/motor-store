import axios from "axios"
import { helper } from "./utils"

const BASE_URL = "https://motor.up.railway.app/api"

export const motorRequest = {
  async get(path: string) {
    return await axios.get(BASE_URL + path)
  },
  async getWithAuthen(path: string) {
    return await axios.get(BASE_URL + path, {
      headers: {
        Authorization: `Bearer ${helper.getCookieValue("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    })
  },
  async post(path: string, data: any) {
    return await axios.post(BASE_URL + path, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
  },
  async postWithAuthen(path: string, data: any) {
    return await axios.post(BASE_URL + path, data, {
      headers: {
        Authorization: `Bearer ${helper.getCookieValue("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    })
  },
  delete() {},
}
