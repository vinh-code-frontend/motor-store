<script setup lang="ts">
import { ref } from "vue"
import type { ICart } from "@/utils/type"
import { ElNotification } from "element-plus"
import { store } from "@/store"

const isVisible = ref(false)
const dialogRef = ref()
const cartData = ref<ICart>({})

const loading2 = ref(false)
const emit = defineEmits(["get-data"])
const openDialog = (data?: ICart) => {
  isVisible.value = true
  cartData.value = { ...data }
}

const handleClose = () => {
  isVisible.value = false
}

const saveData = async () => {
  try {
    loading2.value = true
    await store.dispatch("updateItemInCart", cartData.value)
    emit("get-data")
    ElNotification({
      type: "success",
      title: "Thành công",
      message: "Thay đổi số lượng thành công",
    })
    isVisible.value = false
    loading2.value = false
  } catch (error) {
    loading2.value = false
    ElNotification({
      type: "error",
      title: "Thất bại",
      message: "Lỗi bất định",
    })
  }
}

defineExpose({
  openDialog,
})
</script>
<template>
  <div class="quantity-dialog">
    <el-dialog v-model="isVisible" ref="dialogRef">
      <template #header>
        <h3 style="color: #f56c6c">{{ cartData.motorName }}</h3>
      </template>
      <div class="quantity-dialog-content" v-loading="loading2">
        <h3 style="margin-bottom: 12px">Thay đổi số lượng</h3>
        <el-input-number v-model="cartData.quantity" :min="1" :max="10" />
      </div>
      <template #footer>
        <el-button color="#f56c6c" plain @click="handleClose">Đóng</el-button>
        <el-button color="#f56c6c" @click="saveData" style="color: #fff">Xác nhận</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
