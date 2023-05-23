<script setup lang="ts">
import { ref } from "vue"

const drawer = ref(false)
const orderData = ref()
const openDrawer = (data: any) => {
  drawer.value = true
  orderData.value = { ...data }
}
defineExpose({
  openDrawer,
})
</script>
<template>
  <el-drawer v-model="drawer" class="order-drawer" title="Chi tiết đơn hàng" style="min-width: 400px">
    <i style="font-size: 12px">Có thể hiển thị thêm nhiều thông tin khác tại đây</i>
    <div class="panel-order">
      <div class="panel-order-title">STT</div>
      <div class="panel-order-content">{{ orderData.id }}</div>
      <div class="panel-order-title">Mã đơn hàng</div>
      <div class="panel-order-content">{{ orderData.date }}</div>
      <div class="panel-order-title">Trạng thái</div>
      <div
        :class="[
          'panel-order-content',
          orderData.status === 'Done' && 'text-green',
          orderData.status === 'Pending' && 'text-yellow',
          orderData.status === 'Rejected' && 'text-red',
        ]"
      >
        {{ orderData.text }}
      </div>
      <div class="panel-order-title">Thành tiền</div>
      <div class="panel-order-content">{{ orderData.price }}</div>
    </div>
  </el-drawer>
</template>
<style scoped lang="scss">
.panel-order {
  font-size: 14px;

  display: grid;
  grid-template-columns: 40% 60%;
  gap: 4px;
  align-items: center;
}

.panel-order-title {
  background-color: #ccc;
  margin-right: 8px;
  padding: 4px;
}
</style>

<style lang="scss">
.order-drawer {
  .el-drawer__header {
    margin-bottom: 8px;
  }
}
</style>
