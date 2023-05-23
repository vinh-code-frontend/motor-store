<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { ElMessage, ElMessageBox, ElTable } from "element-plus"
import { helper } from "@/utils/utils"
import { store } from "@/store"

const singleTableRef = ref<InstanceType<typeof ElTable>>()
const chartData = computed(() => store.state.chart)
const loading = ref(true)
const chartMode = ref("0")

const getChart = async (status: any) => {
  loading.value = true
  chartMode.value = status
  await store.dispatch("getChart", { status: status })
  loading.value = false
}

const currentPage = ref(1)
const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  return chartData.value.orders?.slice(startIndex, endIndex)
})

const confirmOrder = async (orderId?: string) => {
  try {
    await ElMessageBox.confirm(`Xác nhận thanh toán đơn hàng`, {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      type: "warning",
      title: "Thông báo",
    })
    try {
      loading.value = true
      await store.dispatch("confirmOrder", orderId)
      await getChart("0")

      loading.value = false
      ElMessage({
        type: "success",
        message: `Chúc mừng bạn đã thanh toán thành công`,
      })
    } catch (error) {
      loading.value = false
      ElMessage({
        type: "error",
        message: `Lỗi bất định`,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await getChart("0")
})
</script>
<template>
  <div class="order-admin">
    <div class="order-admin-content">
      <div class="order-admin-holder">
        <div class="order-admin-top">
          <h3 v-if="chartMode === '0'" class="primary-color" style="margin-bottom: 24px">
            Danh sách đơn hàng chưa thanh toán
          </h3>
          <h3 v-if="chartMode === '1'" class="primary-color" style="margin-bottom: 24px">
            Danh sách đơn hàng đã thanh toán
          </h3>
          <h3 v-if="chartMode === '2'" class="primary-color" style="margin-bottom: 24px">Danh sách đơn hàng bị hủy</h3>
          <div class="order-admin-selector">
            <el-dropdown trigger="click">
              <div class="order-admin-trigger">
                <span class="primary-color">Lọc đơn hàng</span>
                <font-awesome-icon icon="fa-solid fa-filter" class="primary-color" />
              </div>
              <template #dropdown>
                <el-dropdown-menu class="order-admin-menu">
                  <el-dropdown-item @click="getChart('0')">Đơn hàng chưa thanh toán</el-dropdown-item>
                  <el-dropdown-item @click="getChart('1')">Đơn hàng đã thanh toán</el-dropdown-item>
                  <el-dropdown-item @click="getChart('2')">Đơn hàng đã hủy</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <el-table v-loading="loading" ref="singleTableRef" :data="pagingData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100" label="STT" />
          <el-table-column prop="orderId" label="Mã đơn hàng" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createdBy" label="Tài khoản" min-width="120" show-overflow-tooltip />
          <el-table-column label="Thành tiền" min-width="130" show-overflow-tooltip>
            <template #default="scope">
              {{ helper.formatCurrency(scope.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="address" min-width="200" label="Địa chỉ" show-overflow-tooltip>
            <template #default="scope">
              <p v-if="scope.row.address">{{ scope.row.address }}</p>
              <p v-else>Trống</p>
            </template>
          </el-table-column>
          <el-table-column label="Ngày đặt" min-width="150">
            <template #default="scope">
              <div>{{ helper.getDate(scope.row.createdDate) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái" min-width="180" show-overflow-tooltip>
            <template #default="scope">
              <el-tag type="warning" v-if="scope.row.status === 0">Chưa thanh toán</el-tag>
              <el-tag type="success" v-if="scope.row.status === 1">Đã thanh toán</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 2">Đã hủy</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="chartMode === '0'" label="Xác nhận" fixed="right" min-width="120">
            <template #default="scope">
              <el-button type="success" size="small" @click="confirmOrder(scope.row.orderId)">Xác nhận</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-show="!loading">
          <div class="common-count">{{ chartData.total }} đơn hàng</div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="chartData?.orders?.length"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.order-admin {
  width: 100%;
  flex: 1;
}
.order-admin-content {
  position: relative;
  height: fit-content;
}

.order-admin-holder {
  position: absolute;
  inset: 0;

  & h3 {
    margin-bottom: 12px;
  }
}

.order-admin-trigger {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid var(--primary-color);
  padding: 4px 10px;
  border-radius: 6px;
}

.order-admin-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.order-admin-count {
  font-size: 15px;
  margin-top: 24px;
}
</style>
