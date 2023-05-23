<script setup lang="ts">
import AdminImage from "@/assets/images/admin.png"
import { store } from "@/store"
import { ElMessageBox, ElNotification } from "element-plus"
import { ref } from "vue"
import { useRouter } from "vue-router"

const toggleIcon = ref(true)
const router = useRouter()
const emit = defineEmits(["toggle-side-menu"])
const toggleSideMenu = () => {
  toggleIcon.value = !toggleIcon.value
  emit("toggle-side-menu")
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
    console.log(error)
  }
}
</script>

<template>
  <div class="admin-navbar">
    <div class="admin-navbar-holder">
      <div class="admin-navbar-left">
        <font-awesome-icon
          :class="['admin-navbar-icon', toggleIcon && 'left']"
          icon="fa-solid fa-chevron-left"
          @click="toggleSideMenu"
        />
      </div>
      <el-dropdown trigger="click">
        <div class="admin-navbar-right">
          <el-avatar :src="AdminImage" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>
                <div class="admin-navbar-dropdown">
                  <font-awesome-icon icon="fa-solid fa-home" />
                  <span>Trang chủ</span>
                </div>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item @click="handleLogout">
              <div class="admin-navbar-dropdown">
                <font-awesome-icon icon="fa-solid fa-power-off" />
                <span>Đăng xuất</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-navbar {
  box-shadow: 2px 1px 1px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex: 1;
}
.admin-navbar-holder {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-inline: 12px;
}

.admin-navbar-icon {
  padding: 10px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: block;
  color: #fff;
  cursor: pointer;
  transition: all 0.4s ease;
  &.left {
    transform: rotate(180deg);
  }
}

.admin-navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  & img {
    width: 40px;
    object-fit: cover;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
}

.admin-navbar-dropdown {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
