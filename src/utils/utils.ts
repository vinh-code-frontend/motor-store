import jwtDecode from "jwt-decode"
import { ERole } from "./type"
import moment from "moment"

export const helper = {
  formatCurrency(number: number) {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
    return formatter.format(number).replace(/\u00A0/g, " ")
  },
  setAccessToken(token: string, tokenName: string) {
    return (document.cookie = `${tokenName}=${token}`)
  },
  getCookieValue(cookieName: string): string | undefined {
    const cookies = document.cookie.split("; ")
    const cookieRow = cookies.find((row) => row.startsWith(`${cookieName}=`))
    if (cookieRow) {
      return cookieRow.split("=")[1]
    }
    return undefined
  },
  getFirstLetter(name: string) {
    return name[0]
  },
  getDate(date?: string | Date) {
    return moment(date).local().format("hh:mm DD/MM/YYYY")
  },
  randomColor(): { background: string; color: string } {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16)
    const randomColor = "#" + ("000000" + randomHex).slice(-6)
    const colorValue = parseInt(randomColor.slice(1), 16)
    const red = (colorValue >> 16) & 255
    const green = (colorValue >> 8) & 255
    const blue = colorValue & 255
    const backgroundRed = Math.min(Math.floor(red * 1.3), 255)
    const backgroundGreen = Math.min(Math.floor(green * 1.3), 255)
    const backgroundBlue = Math.min(Math.floor(blue * 1.3), 255)
    const color = `rgb(${backgroundRed}, ${backgroundGreen}, ${backgroundBlue})`
    const opacityColor = `rgba(${backgroundRed}, ${backgroundGreen}, ${backgroundBlue}, 0.3)`
    return {
      background: opacityColor,
      color: color,
    }
  },
}

export const middleware = {
  async authMiddleware(to: any, from: any, next: any) {
    const getAccessToken = helper.getCookieValue("accessToken")
    if (getAccessToken) {
      const decodedToken: any = jwtDecode(getAccessToken)
      if (decodedToken.RoleName === ERole.Admin) {
        next({ name: "admin-dashboard" })
      } else if (decodedToken.RoleName === ERole.User) {
        next({ name: "home" })
      }
    } else {
      next()
    }
  },
  async adminMiddleware(to: any, from: any, next: any) {
    const getAccessToken = helper.getCookieValue("accessToken")

    if (getAccessToken) {
      const decodedToken: any = jwtDecode(getAccessToken)
      if (decodedToken.RoleName === ERole.Admin) {
        next()
      } else {
        next({ name: "home" })
      }
    } else {
      next({ name: "login" })
    }
  },
  async userMiddleware(to: any, from: any, next: any) {
    const getAccessToken = helper.getCookieValue("accessToken")

    if (getAccessToken) {
      const decodedToken: any = jwtDecode(getAccessToken)
      if (decodedToken.RoleName === ERole.User) {
        next()
      } else {
        next({ name: "home" })
      }
    } else {
      next({ name: "home" })
    }
  },
}
