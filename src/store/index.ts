import type { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"
import type {
  IMotor,
  ILoginUser,
  IType,
  IOrder,
  IOrderDetails,
  ICart,
  IProductAtOrder,
  IComment,
  IChart,
  IBlogs,
} from "@/utils/type"
import { ERole } from "@/utils/type"
import { motorRequest } from "@/utils/axios"
import { helper } from "@/utils/utils"
import jwtDecode from "jwt-decode"

interface IState {
  cart?: ICart[]
  loginUser: ILoginUser
  types?: IType[]
  users?: ILoginUser[]
  motors?: IMotor[]
  orders?: IOrder[]
  orderDetails?: IOrderDetails
  productCallAtOrderDetails?: IProductAtOrder[]
  comments: IComment[]
  chart: IChart
  blogs: IBlogs
  totalMotors?: number
}

export const key: InjectionKey<Store<IState>> = Symbol()

export const store = createStore<IState>({
  state: {
    cart: [],
    orders: [],
    loginUser: {},
    orderDetails: {},
    comments: [],
    chart: {},
    blogs: {},
    totalMotors: 0,
  },
  getters: {},
  mutations: {
    setCartWithLocalStorage(state, payload) {
      state.cart?.push(payload)
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },
    setCart(state, payload) {
      state.cart = [...payload]
    },
    setLoginUser(state, payload) {
      state.loginUser.email = payload.email
      state.loginUser.fullname = payload.email
      // state.loginUser.phone = payload.phone
      state.loginUser.role = payload.role
    },
    resetState(state) {
      state.cart = []
      state.loginUser = {}
      localStorage.removeItem("cart")
    },
    setTypes(state, payload) {
      state.types = payload?.map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        status: item.status,
      }))
    },
    setAllUsers(state, payload) {
      state.users = payload?.map((item: any) => ({
        id: item.id,
        fullname: item.fullname,
        role: item.roleid === "1" ? ERole.Admin : ERole.User,
        roleid: item.roleid,
        email: item.email,
        password: item.password,
        phone: item.phone,
        status: item.status,
        createdDate: item.createddate,
      }))
    },
    setAllMotor(state, payload) {
      state.motors = payload?.map((item: any) => ({
        id: item.motor.id,
        name: item.motor.name,
        price: item.motor.price,
        type: item.motor.type,
        image: item.imgMotor,
        status: item.motor.status,
        createdDate: item.motor.createddate,
        createdBy: item.motor.createdby,
        description: item.motor.description,
        salePrice: item.motor.salePrice,
        famous: item.motor.farmous,
      }))
      console.log(payload)
      state.totalMotors = payload[0]?.total - 1
      console.log(state.totalMotors)
    },
    setYourOrder(state, payload) {
      state.orders = payload?.map((item: any) => ({
        orderId: item.orderId,
        createdDate: item.createddate,
        createdBy: item.createdby,
        status: item.status,
        totalPrice: item.totalPrice,
        address: item.address,
      }))
    },
    setOrderDetails(state, payload) {
      state.productCallAtOrderDetails = payload?.detailOrder?.map((item: any) => ({
        motorId: item.motorId,
        price: item.price,
        priceSale: item.priceSale,
        quantity: item.quantity,
        motorName: item.motorName,
        motorImg: item.motorImg,
        address: item.address,
      }))
    },
    setYourCart(state, payload) {
      state.cart = payload.map((item: any) => ({
        cartId: item.cartId,
        createBy: item.createBy,
        dateCreated: item.dateCreated,
        motorId: item.motorId,
        motorImg: item.motorImg,
        motorName: item.motorName,
        price: item.price,
        priceSale: item.priceSale,
        quantity: item.quantity,
        totalPrice: item.totalprice,
      }))
    },
    setAllComments(state, payload) {
      state.comments = payload.map((item: any) => ({
        id: item.id,
        comment: item.comment,
        createdDate: item.createdDate,
        createdBy: item.createdby,
        motorId: item.motorId,
        modifyDate: item.modifyDate,
      }))
    },
    setChart(state, payload) {
      state.chart.total = payload.total
      state.chart.orders = payload.orders.map((order: any) => ({
        orderId: order.orderId,
        createdDate: order.createddate,
        createdBy: order.createdby,
        status: order.status,
        totalPrice: order.totalPrice,
        address: order.address,
      }))
    },
    setBlogs(state, payload) {
      state.blogs.total = payload.total
      state.blogs.blogs = payload.blogs.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        img: blog.img,
        createdBy: blog.createdby,
        createdDate: blog.createdDate,
        modifyDate: blog.modifyDate,
      }))
      console.log(state.blogs)
    },
  },
  actions: {
    //? Auth Request
    async login({ commit }, payload) {
      const response = await motorRequest.post("/Login/login", payload)
      if (response && response.data) {
        commit("setLoginUser", response.data)
        helper.setAccessToken(response.data.accessToken, "accessToken")
      }
    },
    async register({ commit }, payload) {
      await motorRequest.post("/Login/register", payload)
    },

    logout({ commit }) {
      document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      commit("resetState")
    },
    decodeToken({ commit }, payload) {
      const decodeTokend: any = jwtDecode(payload)
      commit("setLoginUser", {
        email: decodeTokend.Email,
        role: decodeTokend.RoleName,
        name: decodeTokend.Email,
      })
    },
    //? Start type requests
    async getAllTypes({ commit }) {
      const response = await motorRequest.postWithAuthen("/Motor/getTypes", {})
      commit("setTypes", response.data)
    },
    async newType({ commit }, payload) {
      return await motorRequest.postWithAuthen("/Motor/newTypes", payload)
    },
    async editType({ commit }, payload) {
      return await motorRequest.postWithAuthen("/Motor/editTypes", payload)
    },
    async deleteType({ commit }, payload) {
      await motorRequest.postWithAuthen("/Motor/deleteTypes", payload)
    },
    //? Start motor requests
    async getAllMotors({ commit }) {
      const response = await motorRequest.post("/Motor/searchMotor", {
        searchQuery: "",
        price: "",
        type: "",
        status: "0",
        pageNumber: 0,
        pageSize: 1000,
      })
      commit("setAllMotor", response.data)
    },
    async searchMotor({ commit }, payload) {
      const response = await motorRequest.post("/Motor/searchMotor", {
        searchQuery: payload,
        price: "",
        type: "",
        status: "0",
        pageNumber: 0,
        pageSize: 1000,
        priceSale: 0,
      })
      commit("setAllMotor", response.data)
    },
    async searchMotorWithPaginate({ commit }, payload) {
      const response = await motorRequest.post("/Motor/searchMotor", {
        searchQuery: payload.searchQuery || "",
        price: payload.price || "",
        type: payload.type || "",
        status: "0",
        pageNumber: payload.pageNumber || 0,
        pageSize: payload.pageSize || 10,
        priceSale: payload.priceSale || 0,
      })
      commit("setAllMotor", response.data)
    },
    async filterMotor({ commit }, payload) {
      const response = await motorRequest.post("/Motor/searchMotor", {
        searchQuery: payload.search,
        price: payload.price,
        type: payload.type,
        status: "0",
        pageNumber: 0,
        pageSize: 1000,
        priceSale: payload.sale,
      })
      commit("setAllMotor", response.data)
    },
    async newMotor({ commit }, payload) {
      return await motorRequest.postWithAuthen("/Motor/saveNewMotor", payload)
    },
    async editMotor({ commit }, payload) {
      return await motorRequest.postWithAuthen("/Motor/editMotor", payload)
    },
    async deleteMotor({ commit }, payload) {
      await motorRequest.postWithAuthen("/Motor/deleteMotor", payload)
    },
    //? Start user requests
    async getAllUsers({ commit }) {
      const response = await motorRequest.postWithAuthen("/User/getAllUser", {})
      commit("setAllUsers", response.data)
    },
    async deleteUser({ commit }, payload) {
      await motorRequest.postWithAuthen("/User/deleteUser", payload)
    },
    async editUser({ commit }, payload) {
      await motorRequest.postWithAuthen("/User/editUser", payload)
    },
    //? Order Request
    async getOrdersList({ commit }) {
      const response = await motorRequest.getWithAuthen("/Order/listOrder")
      commit("setYourOrder", response.data)
    },
    async getOrdersDetails({ commit }, payload) {
      const response = await motorRequest.getWithAuthen("/Order/getOrderDetail?idOrder=" + payload)
      console.log(response.data)
      commit("setOrderDetails", response.data)
    },
    async newOrder({ commit }, payload) {
      await motorRequest.postWithAuthen("/Order/newOrder", {
        carts: payload.motorData,
        address: payload.address,
      })
    },
    async confirmOrder({ commit }, payload) {
      await motorRequest.postWithAuthen("/Order/payOrder?orderId=" + payload, {})
    },
    async rejectOrder({ commit }, payload) {
      await motorRequest.postWithAuthen("/Order/cacleOrder?orderId=" + payload, {})
    },
    //? Cart Request
    async addToCart({ commit }, payload) {
      await motorRequest.postWithAuthen("/Cart/addToCart", [
        {
          quantity: payload.quantity,
          motorId: payload.motorId,
        },
      ])
    },
    async getCart({ commit }) {
      const response = await motorRequest.getWithAuthen("/Cart/getCart")
      commit("setYourCart", response.data)
    },

    async deleteCart({ commit }, payload) {
      await motorRequest.postWithAuthen("/Cart/delaValCart?id=" + payload, {})
    },
    async updateItemInCart({ commit }, payload) {
      const response = motorRequest.postWithAuthen("/Cart/updateValCart", payload)
      console.log(response)
    },
    //? Comment Request
    async getComment({ commit }, payload) {
      const response = await motorRequest.get("/Motor/getCmtMotor?motortid=" + payload)
      commit("setAllComments", response.data)
    },
    async newComment({ commit }, payload) {
      await motorRequest.postWithAuthen("/Motor/newCmt", {
        motorId: payload.motorId,
        comment: payload.comment,
      })
    },
    async editComment({ commit }, payload) {
      await motorRequest.postWithAuthen("/Motor/updateCmt", {
        cmtId: payload.cmtId,
        comment: payload.comment,
      })
    },
    async removeComment({ commit }, payload) {
      await motorRequest.postWithAuthen("/Motor/delCmt", {
        cmtId: payload,
      })
    },
    //? Chart Request
    async getChart({ commit }, payload) {
      const response = await motorRequest.postWithAuthen("/Chart/getChart", {
        status: payload.status,
        pageNumber: 0,
        pageSize: 1000,
      })
      commit("setChart", response.data)
    },
    //? Blog Request
    async getAllBlogs({ commit }) {
      const response = await motorRequest.post("/Blog/getBlog", {
        searchData: "",
        pageNumber: 1,
        pageSize: 1000,
      })
      commit("setBlogs", response.data)
    },
    async searchBlog({ commit }, payload) {
      const response = await motorRequest.post("/Blog/getBlog", {
        searchData: payload,
        pageNumber: 1,
        pageSize: 1000,
      })
      commit("setBlogs", response.data)

      console.log(response.data)
    },
    async newBlog({ commit }, payload) {
      const response = await motorRequest.postWithAuthen("/Blog/newBlog", payload)
      console.log(response.data)
    },
    async editBlog({ commit }, payload) {
      const response = await motorRequest.postWithAuthen("/Blog/updateBlog", {
        id: payload.id,
        content: payload.content,
        title: payload.title,
        img: payload.img,
      })
      console.log(response.data)
    },
    async deleteBlog({ commit }, payload) {
      const response = await motorRequest.postWithAuthen("/Blog/delBlog", {
        id: payload,
      })
      console.log(response.data)
    },
  },
})

export function useStore() {
  return baseUseStore(key)
}
