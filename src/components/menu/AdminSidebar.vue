<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { menuSidebarItems } from "@/utils/constants"

interface IProps {
  toggleSideBar?: boolean
}
const menuItem = ref(menuSidebarItems)
const emits = defineEmits(["select-menu"])
const props = defineProps<IProps>()

const handleChangeMenu = (item: any) => {
  menuItem.value.forEach((menu) => {
    if (menu.id === item.id) {
      menu.isActive = true
      emits("select-menu", item.key)
    } else {
      menu.isActive = false
    }
  })
}

onBeforeMount(() => {
  handleChangeMenu(menuItem.value[0])
})
</script>
<template>
  <div :class="['sidebar', toggleSideBar ? 'active' : 'hidden']">
    <h3 :class="['sidebar-header', toggleSideBar && 'active']">{{ toggleSideBar ? "Admin page" : "Admin" }}</h3>
    <div
      v-for="item in menuItem"
      :key="item.id"
      :class="['sidebar-item', item.isActive && 'active']"
      @click="handleChangeMenu(item)"
    >
      <font-awesome-icon :icon="item.icon" />
      <span :class="['sidebar-item-name', !toggleSideBar && 'hidden']">{{ item.name }}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.sidebar {
  background-color: var(--primary-color);
  padding: 12px;
  // width: 90px;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  white-space: normal;
  max-width: 90px;
  width: 100%;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  left: 0;
  top: 0;
  &.active {
    max-width: 220px;
    width: 100%;
    border-radius: 0 16px 16px 0;
  }

  &.hidden {
    .sidebar-item {
      display: flex;
      justify-content: center;
    }
  }
}

.sidebar-header {
  color: #fff;
  border-bottom: 1px solid #ffffff33;
  padding-bottom: 14px;
  padding-top: 1px;
  margin-bottom: 8px;
}

.sidebar-item {
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  padding: 15px 12px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  display: flex;
  gap: 12px;
  align-items: center;
  height: 50px;

  &.active {
    color: #fff;
    background-color: rgb(126, 124, 253);
  }

  &:hover {
    color: #fff;
    background-color: rgb(154, 153, 255);
  }
}

.sidebar-item-name {
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  white-space: normal;
  transition: none;
  &.hidden {
    display: none;
  }
}
</style>
