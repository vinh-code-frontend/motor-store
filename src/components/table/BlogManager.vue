<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import BlogDialog from "../form/BlogDialog.vue"
import { ElMessageBox, ElNotification } from "element-plus"
import { store } from "@/store"
import { helper } from "@/utils/utils"

const blogDialogRef = ref()
const loading = ref(false)
const tableData = computed(() => store.state.blogs)
const currentPage = ref(1)
const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  return tableData.value.blogs?.slice(startIndex, endIndex)
})
const handleOpenDialog = (data?: any) => {
  blogDialogRef.value?.openDialog(data)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm(`Xác nhận xóa bài viết`, "Thông báo", {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    })
    try {
      loading.value = true
      await store.dispatch("deleteBlog", id)
      await store.dispatch("getAllBlogs")
      loading.value = false
      ElNotification({
        title: "Thành công",
        message: `Xóa bài viết thành công!`,
        type: "success",
        duration: 3000,
      })
    } catch (error) {
      loading.value = false
      ElNotification({
        title: "Thất bại",
        message: `Xóa bài viết thất bại!`,
        type: "error",
        duration: 3000,
      })
    }
  } catch (error) {
    console.log("Cancel")
  }
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllBlogs")
  loading.value = false
})
</script>

<template>
  <div class="blog-manager">
    <div class="blog-manager-header">
      <h3 class="primary-color">Quản lý bài viết</h3>
      <el-button type="success" size="small" @click="handleOpenDialog()">Thêm bài viết</el-button>
    </div>
    <div class="blog-manager-content">
      <div class="blog-manager-holder">
        <el-table ref="singleTableRef" v-loading="loading" :data="pagingData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="80" label="STT" />
          <el-table-column prop="title" label="Tên bài viết" min-width="100" show-overflow-tooltip />
          <el-table-column label="Nội dung" min-width="140" show-overflow-tooltip>
            <template #default="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="Người đăng" min-width="100" show-overflow-tooltip />
          <el-table-column label="Ngày đăng" min-width="120">
            <template #default="scope">
              <div>{{ helper.getDate(scope.row.createdDate) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Hình ảnh" min-width="120">
            <template #default="scope">
              <img :src="scope.row.img" alt="" width="120" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="" min-width="140">
            <template #default="scope">
              <el-button type="warning" size="small" @click="handleOpenDialog(scope.row)">Sửa</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Xóa</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-if="!loading">
          <div class="common-count" v-show="!loading">{{ tableData?.total }} bài viết</div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="tableData?.total"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <blog-dialog ref="blogDialogRef" />
</template>
<style scoped lang="scss">
.blog-manager {
  width: 100%;
}

.blog-manager-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.blog-manager-content {
  position: relative;
}

.blog-manager-holder {
  position: absolute;
  inset: 0;
}

.blog-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.blog-admin-count {
  font-size: 15px;
  margin-top: 24px;
}
</style>
