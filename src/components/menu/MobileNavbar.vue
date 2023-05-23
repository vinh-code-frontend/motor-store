<script setup lang="ts">
import { store } from "@/store"
import { ElMessageBox, ElNotification } from "element-plus"
import router from "@/router"
import { computed, ref } from "vue"
import { ERole } from "@/utils/type"

const isVisible = ref(false)
const openDrawer = () => {
  isVisible.value = true
}
const badge = computed(() => store.state.cart)
const badgeOrder = computed(() => store.state.orders?.filter((item) => item.status === 0))
const loginUser = computed(() => store.state.loginUser)
const handleClose = () => {
  isVisible.value = false
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
defineExpose({
  openDrawer,
})
</script>
<template>
  <el-drawer v-model="isVisible" class="mobile-navbar" size="70%" :show-close="false">
    <template #header>
      <div class="mobile-navbar-header">
        <div class="mobile-navbar-header-left">
          <font-awesome-icon icon="fa-solid fa-motorcycle" class="icon" />
          <h3>Motor Store</h3>
        </div>
        <div class="mobile-navbar-header-right">
          <font-awesome-icon icon="fa-solid fa-xmark" class="icon" @click="handleClose" />
        </div>
      </div>
    </template>
    <div class="navbar-menu">
      <b class="navbar-username">
        Xin chào: <i>{{ loginUser.email }}</i>
      </b>
      <router-link to="/" class="navbar-menu-item">Trang chủ</router-link>
      <router-link to="/blogs" class="navbar-menu-item">Bài viết</router-link>
      <router-link v-if="!loginUser.email" to="/login" class="navbar-menu-item">Đăng nhập</router-link>
      <router-link v-if="loginUser.role === ERole.User" to="/cart" class="navbar-menu-mobile-item">
        <el-badge :value="badge?.length">
          <font-awesome-icon icon="fa-solid fa-cart-shopping" />
        </el-badge>
        <span>Giỏ hàng</span>
      </router-link>
      <router-link v-if="loginUser.role === ERole.User" to="/order" class="navbar-menu-mobile-item">
        <el-badge :value="badgeOrder?.length">
          <font-awesome-icon icon="fa-solid fa-bag-shopping" />
        </el-badge>
        <span>Đơn hàng</span>
      </router-link>
      <div v-if="loginUser.email" class="navbar-menu-mobile-item" @click="handleLogout">
        <font-awesome-icon icon="fa-solid fa-power-off" />
        <span>Đăng xuất</span>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.mobile-navbar-header {
  color: #000;
  font-style: italic;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-navbar-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-navbar-header-right {
  & .icon {
    font-size: 16px;
  }
}

.navbar-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navbar-menu-mobile-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
