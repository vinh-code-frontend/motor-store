<script setup lang="ts">
import { computed, ref } from "vue"
import MobileNavbar from "./MobileNavbar.vue"
import { store } from "@/store"
import { ERole } from "@/utils/type"
import { ElMessageBox, ElNotification } from "element-plus"
import router from "@/router"
import { helper } from "@/utils/utils"

const mobileNavbar = ref()
const badge = computed(() => store.state.cart)
const badgeOrder = computed(() => store.state.orders?.filter((item) => item.status === 0))
const loginUser = computed(() => store.state.loginUser)
const openMobileMenu = () => {
  mobileNavbar.value.openDrawer()
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("Xác nhận đăng xuất khỏi hệ thống?", {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      title: "Thông báo",
      type: "warning",
    })
    store.dispatch("logout")
    ElNotification({
      type: "success",
      title: "Thông báo",
      message: "Đăng xuất thành công",
    })
    router.go(0)
  } catch (error) {
    console.log("cancel")
  }
}
</script>

<template>
  <div class="navbar-height">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <font-awesome-icon icon="fa-solid fa-motorcycle" />
        <h3>Motor Store</h3>
      </router-link>
      <div class="navbar-menu">
        <router-link to="/" class="navbar-menu-item">Trang chủ</router-link>
        <router-link to="/blogs" class="navbar-menu-item">Bài viết</router-link>
        <router-link v-if="!loginUser.email" to="/login" class="navbar-menu-item">Đăng nhập</router-link>
        <router-link v-if="loginUser.role === ERole.User" to="/cart" class="navbar-menu-item">
          <el-badge :value="badge?.length">
            <font-awesome-icon icon="fa-solid fa-cart-shopping" />
          </el-badge>
          <span>Giỏ hàng</span>
        </router-link>
        <router-link v-if="loginUser.role === ERole.User" to="/order" class="navbar-menu-item">
          <el-badge :value="badgeOrder?.length">
            <font-awesome-icon icon="fa-solid fa-bag-shopping" />
          </el-badge>
          <span>Đơn hàng</span>
        </router-link>
        <div class="navbar-menu-item" v-if="loginUser.email">
          <el-dropdown trigger="click">
            <div class="navbar-avatar" :style="{ backgroundColor: `${helper.randomColor().background}` }">
              {{ helper.getFirstLetter(loginUser.email) }}
            </div>
            <template #dropdown>
              <el-dropdown-menu class="navbar-menu-dropdown">
                <b class="navbar-username">
                  Xin chào: <i>{{ loginUser.email }}</i>
                </b>
                <el-dropdown-item v-if="loginUser.role === ERole.Admin">
                  <router-link to="/admin-dashboard" style="display: block; width: 100%">
                    <div class="navbar-dropdown">
                      <font-awesome-icon icon="fa-solid fa-home" />
                      <span>Trang quản lý</span>
                    </div>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="loginUser.role === ERole.User">
                  <router-link to="/cart">
                    <div class="navbar-dropdown">
                      <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                      <span>Giỏ hàng của bạn</span>
                    </div></router-link
                  >
                </el-dropdown-item>
                <el-dropdown-item v-if="loginUser.role === ERole.User">
                  <router-link to="/order">
                    <div class="navbar-dropdown">
                      <font-awesome-icon icon="fa-solid fa-bag-shopping" />
                      <span>Đơn đặt hàng của bạn</span>
                    </div></router-link
                  >
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  <div class="navbar-dropdown">
                    <font-awesome-icon icon="fa-solid fa-power-off" />
                    <span>Đăng xuất</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="navbar-menu-mobile-button" @click="openMobileMenu">
        <font-awesome-icon icon="fa-solid fa-bars" class="menu-mobile-icon" />
      </div>
    </nav>
  </div>
  <mobile-navbar ref="mobileNavbar" />
</template>

<style scoped lang="scss">
.navbar-height {
  margin-bottom: 58px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  box-shadow: 2px 1px 1px 0px rgba(0, 0, 0, 0.2);
  height: 58px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1000;
}

.navbar-logo {
  display: flex;
  gap: 8px;
  font-style: italic;
  align-items: center;
  cursor: pointer;
}

.navbar-search {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 1000px;
  overflow: hidden;

  & input {
    line-height: 32px;
    padding-inline: 18px;
  }

  & button {
    line-height: 32px;
    padding-inline: 14px;
  }
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 24px;

  .navbar-menu-item {
    cursor: pointer;
    gap: 12px;
    display: flex;
    align-items: center;
    position: relative;
    color: #555;

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 50%;
      background-color: #555;
      transition: all 0.3s ease;
    }

    &:hover {
      color: #000;
      &::after {
        width: 100%;
        left: 0;
        color: #000;
      }
    }
  }
}

.navbar-menu-mobile-button {
  display: none;
}

.menu-mobile-icon {
  font-size: 24px;
}

.navbar-menu-dropdown {
  min-width: 200px;
}

.navbar-username {
  padding: 2px 12px 6px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  margin-bottom: 4px;
  overflow: hidden;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  white-space: normal;
}

.navbar-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media screen and (max-width: 700px) {
  .navbar-menu {
    display: none;
  }

  .navbar-menu-mobile-button {
    display: block;
  }
}

.navbar-avatar {
  width: 40px;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  text-transform: uppercase;
  border-radius: 50%;
  border: 1px solid #ccc;
}
</style>
