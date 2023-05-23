<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import UserPanel from "../form/UserPanel.vue"
import { ElMessageBox, ElNotification } from "element-plus"
import { store } from "@/store"

const productPanelRef = ref()
const loading = ref(false)
const usersData = computed(() => store.state.users)
const loginUser = computed(() => store.state.loginUser)
const handleOpenDrawer = (data?: any) => {
  productPanelRef.value?.openDrawer(data)
}
const searchInput = ref("")
const refSearchInput = ref("")
const currentPage = ref(1)

const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  if (refSearchInput.value === "") {
    return usersData.value?.slice(startIndex, endIndex)
  }
  return usersData.value?.filter((item) => item.fullname?.includes(refSearchInput.value)).slice(startIndex, endIndex)
})

const handleDeleteUser = async (data: any) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn xóa user ${data.fullname} không?`, "Thông báo", {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    })
    loading.value = true
    await store.dispatch("deleteUser", {
      Id: data.id,
    })
    await store.dispatch("getAllUsers")
    loading.value = false
    ElNotification({
      title: "Thành công",
      message: `Xóa ${data.fullname} thành công!`,
      type: "success",
      duration: 3000,
    })
  } catch (error) {
    console.log("Cancel")
  }
}

const searchUser = () => {
  loading.value = true
  setTimeout(() => {
    refSearchInput.value = searchInput.value
    loading.value = false
  }, 1000)
}

const resetUser = () => {
  loading.value = true
  setTimeout(() => {
    searchInput.value = ""
    refSearchInput.value = ""
    loading.value = false
  }, 1000)
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllUsers")
  loading.value = false
})
</script>

<template>
  <div class="user-manager">
    <div class="user-manager-header">
      <h3 class="primary-color">Quản lý User</h3>
      <div class="user-manager-right">
        <div class="user-manager-search" v-if="!loading">
          <input v-model="searchInput" type="text" placeholder="Tìm kiếm theo tên..." />
          <button @click="searchUser"><font-awesome-icon icon="fa-solid fa-search" /></button>
        </div>
        <el-button plain size="small" @click="resetUser" :disabled="loading">Reset</el-button>

        <el-button type="success" size="small" @click="handleOpenDrawer()">Thêm user</el-button>
      </div>
    </div>
    <div class="user-manager-content">
      <div class="user-manager-holder">
        <el-table ref="singleTableRef" v-loading="loading" :data="pagingData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100" label="STT" />
          <el-table-column prop="fullname" label="Tên người dùng" show-overflow-tooltip min-width="180" />
          <el-table-column prop="email" label="Email" show-overflow-tooltip min-width="200" />
          <el-table-column prop="role" label="Quyền" show-overflow-tooltip min-width="100" />
          <el-table-column fixed="right" label="" min-width="140">
            <template #default="scope">
              <el-button
                v-if="scope.row.email !== loginUser.email"
                type="warning"
                size="small"
                @click="handleOpenDrawer(scope.row)"
                >Sửa</el-button
              >
              <el-button
                v-if="scope.row.email !== loginUser.email"
                type="danger"
                size="small"
                @click="handleDeleteUser(scope.row)"
                >Xóa</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-if="!loading">
          <div class="common-count" v-show="!loading">
            Hiển thị {{ pagingData?.length }} / {{ usersData?.length }} người dùng
          </div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="usersData?.length"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <user-panel ref="productPanelRef" />
</template>
<style scoped lang="scss">
.user-manager {
  width: 100%;
}

.user-manager-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.user-manager-content {
  position: relative;
}

.user-manager-holder {
  position: absolute;
  inset: 0;
}

.user-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.user-manager-right {
  display: flex;
  align-items: center;
}

.user-manager-search {
  margin-right: 12px;
  border: 1px solid #626aef;
  border-radius: 100px;
  overflow: hidden;

  & input {
    padding: 4px 12px;
  }

  & button {
    padding: 4px 12px;
    background-color: #626aef;
    color: #fff;
  }
}
</style>
