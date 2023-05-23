<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import ProductPanel from "../form/ProductPanel.vue"
import { ElMessageBox, ElNotification, ElMessage } from "element-plus"
import { store } from "@/store"
import { helper } from "@/utils/utils"

const productPanelRef = ref()
const motorData = computed(() => store.state.motors)
const loading = ref(false)
const searchInput = ref("")
const currentPage = ref(1)
const pageSize = ref(10)
const totalMotors = computed(() => store.state.totalMotors)

const searchMotor = async () => {
  loading.value = true
  await store.dispatch("searchMotor", searchInput.value)
  loading.value = false
}

const resetMotor = async () => {
  loading.value = true
  await store.dispatch("searchMotor", "")
  searchInput.value = ""
  loading.value = false
}

const handleOpenDrawer = (data?: any) => {
  productPanelRef.value?.openDrawer(data)
}

const deleteProduct = async (data: any) => {
  loading.value = true

  try {
    await store.dispatch("deleteMotor", {
      Id: data.id,
    })
    await store.dispatch("getAllMotors")
    loading.value = false
  } catch (error) {
    loading.value = false
    ElMessage({
      type: "error",
      message: "Lỗi bất định",
    })
  }
}

const handleDelete = async (data: any) => {
  try {
    await ElMessageBox.confirm(`Bạn có chắc muốn xóa motor ${data.name} không?`, "Thông báo", {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    })
    await deleteProduct(data)
    ElNotification({
      title: "Thành công",
      message: `Xóa motor thành công!`,
      type: "success",
      duration: 3000,
    })
  } catch (error) {
    console.log("Cancel")
  }
}

const handleSizeChange = (page: any) => {
  console.log(page)
}

const handleCurrentChange = async (page: any) => {
  loading.value = true
  await store.dispatch("searchMotorWithPaginate", {
    pageNumber: page,
    pageSize: 10,
  })
  currentPage.value = page
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("searchMotorWithPaginate", {
    pageNumber: 1,
    pageSize: 10,
  })
  await store.dispatch("getAllTypes")
  loading.value = false
})
</script>

<template>
  <div class="product-manager">
    <div class="product-manager-header">
      <h3 class="primary-color">Quản lý motor</h3>
      <div class="product-manager-right">
        <div class="product-manager-search" v-if="!loading">
          <input v-model="searchInput" type="text" placeholder="Tìm kiếm theo tên..." />
          <button @click="searchMotor"><font-awesome-icon icon="fa-solid fa-search" /></button>
        </div>
        <el-button plain size="small" @click="resetMotor()" :disabled="loading">Reset</el-button>
        <el-button type="success" size="small" @click="handleOpenDrawer()" :disabled="loading">Thêm motor</el-button>
      </div>
    </div>

    <div class="product-manager-content">
      <div class="product-manager-holder">
        <el-table ref="singleTableRef" v-loading="loading" :data="motorData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100" label="STT" />
          <el-table-column prop="name" label="Tên motor" min-width="140" show-overflow-tooltip />
          <el-table-column prop="type" label="Danh mục" min-width="100" show-overflow-tooltip />
          <el-table-column prop="price" label="Giá gốc" min-width="100" show-overflow-tooltip>
            <template #default="scope">
              {{ helper.formatCurrency(+scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="Giá đã giảm" min-width="100" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.salePrice && scope.row.salePrice !== 'undefined'">
                {{ helper.formatCurrency(+scope.row.salePrice) }}
              </div>
              <div v-else>Không</div>
            </template>
          </el-table-column>
          <el-table-column label="Hình ảnh" min-width="100">
            <template #default="scope">
              <img
                v-if="scope.row.image.length > 0"
                :src="scope.row.image[0]"
                alt=""
                style="width: 40px; object-fit: cover; height: 40px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="Nổi bật" min-width="100" show-overflow-tooltip>
            <template #default="scope">
              <el-tag v-if="scope.row.famous === 1" type="success">Nổi bật</el-tag>
              <el-tag v-else type="info">Không</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="" min-width="150">
            <template #default="scope">
              <el-button type="warning" size="small" @click="handleOpenDrawer(scope.row)">Sửa</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">Xóa</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-if="!loading">
          <div class="common-count" v-show="!loading">{{ totalMotors }} sản phẩm</div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="totalMotors"
              :page-size="pageSize"
              background
              layout="prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <product-panel ref="productPanelRef" />
</template>
<style scoped lang="scss">
.product-manager {
  width: 100%;
}

.product-manager-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.product-manager-content {
  position: relative;
}

.product-manager-holder {
  position: absolute;
  inset: 0;
}

.product-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.product-manager-right {
  display: flex;
  align-items: center;
}

.product-manager-search {
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
