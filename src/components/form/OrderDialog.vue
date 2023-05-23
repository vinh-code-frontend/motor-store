<script setup lang="ts">
import { ref } from "vue"
import { store } from "@/store"
import { computed } from "vue"
import type { IOrder } from "@/utils/type"
import type { IOrderDetails } from "@/utils/type"
import { helper } from "@/utils/utils"
import { ElMessage, ElMessageBox } from "element-plus"

const isVisible = ref(false)
const drawerRef = ref()
const motorInOrder = computed(() => store.state.productCallAtOrderDetails)
const loading = ref(false)
const finalData = ref<IOrderDetails>({})

const openDialog = async (data: IOrder) => {
  isVisible.value = true
  loading.value = true
  await store.dispatch("getOrdersDetails", data.orderId)
  finalData.value.orderId = data.orderId
  finalData.value.totalPrice = data.totalPrice
  finalData.value.createdDate = data.createdDate
  finalData.value.status = data.status
  finalData.value.address = data.address
  finalData.value.products = motorInOrder.value
  loading.value = false
}

const rejectOrder = async () => {
  try {
    await ElMessageBox.confirm(`Xác nhận hủy đơn hàng`, {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      type: "warning",
      title: "Thông báo",
    })
    try {
      loading.value = true
      await store.dispatch("rejectOrder", finalData.value.orderId)

      await store.dispatch("getOrdersList")

      loading.value = false
      isVisible.value = false
      ElMessage({
        type: "success",
        message: `Bạn đã hủy đơn hàng`,
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

defineExpose({
  openDialog,
})
</script>
<template>
  <div class="order-dialog">
    <el-drawer v-model="isVisible" ref="drawerRef" style="min-width: 500px">
      <template #header>
        <p class="primary-color" style="font-size: 18px; font-weight: 600">Chi tiết đơn hàng</p>
      </template>
      <div class="order-dialog-content" v-loading="loading">
        <div class="order-dialog-item">
          <div class="order-dialog-item-title">Mã đơn hàng</div>
          <div class="order-dialog-item-content">
            {{ finalData.orderId }}
          </div>
        </div>
        <div class="order-dialog-item">
          <div class="order-dialog-item-title">Ngày tạo</div>
          <div class="order-dialog-item-content">
            {{ helper.getDate(finalData.createdDate) }}
          </div>
        </div>
        <div class="order-dialog-item" v-if="finalData.address">
          <div class="order-dialog-item-title">Địa chỉ</div>
          <div class="order-dialog-item-content">
            {{ finalData.address }}
          </div>
        </div>
        <div class="order-dialog-item">
          <div class="order-dialog-item-title">Trạng thái</div>
          <div v-if="finalData.status === 0" class="order-dialog-item-content">
            <el-tag type="warning"> Đang chờ </el-tag>
          </div>
          <div v-if="finalData.status === 1" class="order-dialog-item-content">
            <el-tag type="success">Đã thanh toán</el-tag>
          </div>
          <div v-if="finalData.status === 2" class="order-dialog-item-content">
            <el-tag type="info">Đã hủy</el-tag>
          </div>
        </div>
        <div v-for="(motor, index) in finalData.products" :key="index" class="order-dialog-item">
          <div class="order-dialog-item-title">Sản phẩm {{ index + 1 }}</div>
          <div class="order-dialog-item-content flex">
            <div class="flex">
              <div class="title">Tên sản phẩm:</div>
              <div class="content">{{ motor.motorName }}</div>
            </div>
            <div class="flex" v-if="motor.priceSale">
              <div class="title">Đơn giá:</div>
              <div class="content">{{ helper.formatCurrency(+motor.priceSale!) }}</div>
            </div>
            <div class="flex" v-if="!motor.priceSale">
              <div class="title">Đơn giá:</div>
              <div class="content">{{ helper.formatCurrency(+motor.price!) }}</div>
            </div>
            <div class="flex">
              <div class="title">Số lượng:</div>
              <div class="content">{{ motor.quantity }}</div>
            </div>
            <div class="flex">
              <div class="title">Hình ảnh:</div>
              <div class="content">
                <img :src="motor.motorImg" width="100" />
              </div>
            </div>
          </div>
        </div>
        <div class="order-dialog-item">
          <div class="order-dialog-item-title">Thành tiền</div>
          <div class="order-dialog-item-content">
            {{ helper.formatCurrency(+finalData.totalPrice!) }}
          </div>
        </div>
      </div>
      <template #footer>
        <el-button v-if="finalData.status === 0" type="danger" @click="rejectOrder" :disabled="loading"
          >Hủy đơn hàng</el-button
        >
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.order-dialog-item {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.order-dialog-item-title {
  background-color: #dedede;
  padding: 8px;
  max-width: 140px;
  width: 100%;
}

.order-dialog-item-content {
  align-self: center;
  .flex {
    display: flex;
    gap: 8px;
  }
}
</style>

<style lang="scss">
.order-dialog {
  font-size: 15px;
  font-weight: 400;
}
</style>
