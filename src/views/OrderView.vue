<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import { store } from "@/store"
import { computed, onMounted, ref } from "vue"
import SkeletonOrder from "@/components/skeleton/SkeletonOrder.vue"
import { helper } from "@/utils/utils"
import OrderDialog from "@/components/form/OrderDialog.vue"
import CommonFooter from "@/components/common/Footer.vue"

document.title = "Đơn đặt hàng | Motor Store"

const loading = ref(false)
const getYourOrders = computed(() => store.state.orders)
const orderDialogRef = ref()
const badgeOrder = computed(() => store.state.orders?.filter((item) => item.status === 0))
const openPanel = (orderId: string) => {
  orderDialogRef.value?.openDialog(orderId)
}

const currentPage = ref(1)
const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  return getYourOrders.value?.slice(startIndex, endIndex)
})

onMounted(async () => {
  loading.value = true
  await store.dispatch("getOrdersList")
  loading.value = false
})
</script>
<template>
  <navbar />
  <div v-if="loading">
    <skeleton-order />
  </div>
  <div v-if="!loading" class="order">
    <div v-if="!getYourOrders?.length" style="text-align: center">Bạn chưa có đơn hàng nào</div>
    <div v-if="getYourOrders?.length">
      <h3 style="margin-bottom: 32px">Bạn còn lại {{ badgeOrder?.length }} đơn hàng chưa thanh toán</h3>
      <el-table :data="pagingData" size="large">
        <el-table-column type="index" />
        <el-table-column prop="orderId" label="Mã đơn hàng" show-overflow-tooltip />
        <el-table-column label="Ngày tạo" show-overflow-tooltip>
          <template #default="scope">
            {{ helper.getDate(scope.row.createdDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="Địa chỉ" show-overflow-tooltip>
          <template #default="scope">
            <p v-if="scope.row.address">{{ scope.row.address }}</p>
            <p v-else>Trống</p>
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.status === 0"><el-tag type="warning"> Đang chờ </el-tag></div>
            <div v-if="scope.row.status === 1"><el-tag type="success">Đã thanh toán</el-tag></div>
            <div v-if="scope.row.status === 2"><el-tag type="info">Đã hủy</el-tag></div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="Thành tiền" show-overflow-tooltip>
          <template #default="scope">
            {{ helper.formatCurrency(+scope.row.totalPrice) }}
          </template>
        </el-table-column>
        <el-table-column #default="scope">
          <el-button @click="openPanel(scope.row)" color="#626aef" size="small">Chi tiết</el-button>
        </el-table-column>
      </el-table>
      <div class="common-paginate" v-if="!loading">
        <el-pagination
          v-model:current-page="currentPage"
          :total="getYourOrders?.length"
          background
          layout="prev, pager, next"
        />
      </div>
    </div>
  </div>
  <common-footer />

  <order-dialog ref="orderDialogRef" />
</template>
<style scoped lang="scss">
.order {
  max-width: 1200px;
  margin: 0 auto;
  padding-block: 24px;
}

@media screen and (max-width: 1200px) {
  .order {
    padding-inline: 24px;
  }
}
</style>
