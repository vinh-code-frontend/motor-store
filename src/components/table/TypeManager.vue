<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { ElMessageBox, ElNotification } from "element-plus"
import TypeForm from "@/components/form/TypeForm.vue"
import { store } from "@/store"

const typeFormRef = ref()
const loading = ref(true)
const allTypes = computed(() => store.state.types)
const handleOpenForm = (data?: any) => {
  typeFormRef.value?.openDialog(data)
}
const currentPage = ref(1)
const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  return allTypes.value?.slice(startIndex, endIndex)
})

const deleteType = async (data: any) => {
  try {
    loading.value = true
    await store.dispatch("deleteType", {
      Name: data.name,
      Code: data.code,
    })
    await store.dispatch("getAllTypes")
    loading.value = false
  } catch (error) {
    throw new Error("Lỗi bất định")
  }
}

const handleDelete = async (data: any) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn xóa ${data.name} không?`, "Thông báo", {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    })
    await deleteType(data)
    ElNotification({
      title: "Thành công",
      message: `Xóa ${data.name} thành công!`,
      type: "success",
      duration: 3000,
    })
  } catch (error) {
    ElNotification({
      title: "Thất bại",
      message: `Xóa danh mục thất bại!`,
      type: "error",
      duration: 3000,
    })
  }
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllTypes")
  loading.value = false
})
</script>

<template>
  <div class="type-manager">
    <div class="type-manager-header">
      <h3 class="primary-color">Quản lý danh mục motor</h3>
      <el-button type="success" size="small" @click="handleOpenForm()">Thêm danh mục</el-button>
    </div>
    <div class="type-manager-content">
      <div class="type-manager-holder">
        <el-table v-loading="loading" ref="singleTableRef" :data="pagingData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100" label="STT" />
          <el-table-column prop="name" label="Tên danh mục" />
          <el-table-column prop="code" label="Mã danh mục" />
          <el-table-column prop="status" label="Trạng thái" />
          <el-table-column fixed="right" min-width="160">
            <template #default="scope">
              <el-button type="warning" size="small" @click="handleOpenForm(scope.row)">Sửa</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">Xóa</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-if="!loading">
          <div class="common-count" v-show="!loading">{{ allTypes?.length }} danh mục</div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="allTypes?.length"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <type-form ref="typeFormRef" />
</template>
<style scoped lang="scss">
.type-manager {
  width: 100%;
}

.type-manager-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.type-manager-content {
  position: relative;
}

.type-manager-holder {
  position: absolute;
  inset: 0;
}

.type-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>
