export interface IMotor {
  id?: string
  name?: string
  price?: string
  type?: string
  image?: string[]
  status?: string | number
  createdDate?: string | Date
  createdBy?: string
  description?: string
  famous?: number
  salePrice?: number | string
}

export interface ICart {
  cartId?: string
  createBy?: string
  dateCreated?: string
  motorId?: string
  motorImg?: string
  motorName?: string
  price?: string
  quantity?: number
  totalPrice?: string
  priceSale?: string
  address?: string
}

export interface ILoginUser {
  id?: string
  email?: string
  password?: string
  phone?: string
  fullname?: string
  status?: any
  role?: ERole
  roleid?: any
  createdDate?: string | Date
}

export enum ERole {
  Admin = "ADMIN",
  User = "USER",
}

export interface IType {
  id?: number | string
  name?: string
  code?: string
  status?: EType
}

export enum EType {
  active = "1",
  unactive = "0",
}

export interface IOrder {
  orderId?: string
  createdDate?: string | Date
  createdBy?: string
  status?: number
  totalPrice?: string
  address?: string
}

export interface IOrderDetails {
  orderId?: string
  totalPrice?: string
  createdDate?: string | Date
  status?: number
  products?: IProductAtOrder[]
  address?: string
}

export interface IProductAtOrder {
  motorId?: string
  price?: string
  priceSale?: string
  quantity?: number
  motorName?: string
  motorImg?: string
}

export interface IComment {
  id?: string
  motorId?: string
  createdDate?: string | Date
  createdBy?: string
  comment?: string
  modifyDate?: string | Date
}

export interface IChart {
  total?: number
  orders?: IOrder[]
}

export interface IBlog {
  id?: string
  title?: string
  content?: string
  img?: string
  createdBy?: string
  createdDate?: string | Date
  modifyDate?: string | Date
}

export interface IBlogs {
  blogs?: IBlog[]
  total?: number
}
