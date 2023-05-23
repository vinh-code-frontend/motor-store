<script setup lang="ts">
import AdminSidebar from "@/components/menu/AdminSidebar.vue"
import AdminNavbar from "@/components/menu/AdminNavbar.vue"
import Statistical from "@/components/table/Statistical.vue"
import ProductManager from "@/components/table/ProductManager.vue"
import BlogManager from "@/components/table/BlogManager.vue"
import CartManager from "@/components/table/CartManager.vue"
import UserManager from "@/components/table/UserManager.vue"
import TypeManager from "@/components/table/TypeManager.vue"

import { ref } from "vue"
const dashboardContent = ref("statistical")
const toggleSidebar = ref(true)
const handleSelectMenu = (key: any) => {
  dashboardContent.value = key
}

const handleToggleMenu = () => {
  toggleSidebar.value = !toggleSidebar.value
}
document.title = "Dashboard | Motor Store"
</script>

<template>
  <div class="dashboard">
    <admin-sidebar @select-menu="handleSelectMenu" :toggle-side-bar="toggleSidebar" />
    <div :class="['dashboard-container', toggleSidebar ? 'active' : 'hide']">
      <admin-navbar @toggle-side-menu="handleToggleMenu" />
      <div :class="['dashboard-content', toggleSidebar ? 'active' : 'hide']">
        <statistical v-if="dashboardContent === 'statistical'" />
        <product-manager v-if="dashboardContent === 'product-manager'" />
        <blog-manager v-if="dashboardContent === 'blog-manager'" />
        <cart-manager v-if="dashboardContent === 'cart-manager'" />
        <user-manager v-if="dashboardContent === 'user-manager'" />
        <type-manager v-if="dashboardContent === 'type-manager'" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
}

.dashboard-container {
  min-height: 100vh;
  flex: 1;
  margin-left: 220px;

  &.hide {
    margin-left: 80px;
  }
}

.dashboard-content {
  padding: 18px 32px;
  display: flex;
  flex: 1;
}
</style>
