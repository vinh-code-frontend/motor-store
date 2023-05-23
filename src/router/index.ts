import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import DashBoardView from "@/views/DashBoardView.vue"
import CartView from "@/views/CartView.vue"
import LoginView from "@/views/LoginView.vue"
import RegisterView from "@/views/RegisterView.vue"
import DetailsView from "@/views/DetailsView.vue"
import BlogView from "@/views/BlogView.vue"
import OrderView from "@/views/OrderView.vue"
import BlogDetailsView from "@/views/BlogDetailsView.vue"
import { middleware } from "@/utils/utils"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        middleware: middleware.authMiddleware,
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        middleware: middleware.authMiddleware,
      },
    },
    {
      path: "/motor-:id",
      name: "motor-detail",
      component: DetailsView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
      meta: {
        middleware: middleware.userMiddleware,
      },
    },
    {
      path: "/blogs",
      name: "blogs",
      component: BlogView,
    },
    {
      path: "/blog-:id",
      name: "blog-detail",
      component: BlogDetailsView,
    },
    {
      path: "/order",
      name: "order",
      component: OrderView,
      meta: {
        middleware: middleware.userMiddleware,
      },
    },
    {
      path: "/admin-dashboard",
      name: "admin-dashboard",
      component: DashBoardView,
      meta: {
        middleware: middleware.adminMiddleware,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware: any = to.meta.middleware
    middleware(to, from, next)
  } else {
    next()
  }
})

export default router
