<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import type { IType } from "@/utils/type"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { motorRequest } from "@/utils/axios"
import { store } from "@/store"

const isVisible = ref(false)
const dialogRef = ref()
const formInstance = ref<FormInstance>()
const typeData = ref<IType>({})
const loading = ref(false)
const typeTitle = ref({
  label: "",
  button: "",
})

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "Trường này không được để trống!",
    },
  ],
  code: [
    {
      required: true,
      message: "Trường này không được để trống!",
    },
  ],
})
const openDialog = (data?: any) => {
  isVisible.value = true
  if (data) {
    typeData.value = { ...data, id: data.code }
    typeTitle.value = {
      label: "Chỉnh sửa thông tin danh mục",
      button: "Cập nhật",
    }
  } else {
    typeData.value = {}
    typeTitle.value = {
      label: "Thêm danh mục mới",
      button: "Lưu",
    }
  }
}

const handleClose = () => {
  isVisible.value = false
}

const handleSubmit = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      submitData()
    } else {
      console.log("error submit!")
      return false
    }
  })
}

const submitData = async () => {
  try {
    if (typeData.value.id) {
      // Update Item
      loading.value = true
      await store.dispatch("editType", {
        Code: typeData.value.code,
        Name: typeData.value.name,
        Status: typeData.value.status,
      })
      await store.dispatch("getAllTypes")
      ElMessage({
        type: "success",
        message: "Chỉnh sửa danh mục thành công!",
      })
    } else {
      // Add New
      loading.value = true
      await store.dispatch("newType", {
        Code: typeData.value.code,
        Name: typeData.value.name,
      })
      await store.dispatch("getAllTypes")
      ElMessage({
        type: "success",
        message: "Thêm danh mục mới thành công!",
      })
    }
    isVisible.value = false
    loading.value = false
  } catch (error) {
    ElMessage({
      type: "error",
      message: "Lỗi bất định",
    })
    isVisible.value = false
  }
}

defineExpose({
  openDialog,
})
</script>
<template>
  <div class="type-dialog">
    <el-dialog v-model="isVisible" ref="dialogRef">
      <template #header>
        <p>{{ typeTitle.label }}</p>
      </template>
      <div class="type-dialog-content" v-loading="loading">
        <el-form
          ref="formInstance"
          :model="typeData"
          :rules="rules"
          label-position="top"
          require-asterisk-position="right"
        >
          <el-form-item prop="name" label="Tên danh mục" style="margin-bottom: 20px" size="large">
            <el-input v-model="typeData.name" placeholder="Nhập tên danh mục" />
          </el-form-item>
          <el-form-item prop="code" label="Mã danh mục" size="large">
            <el-input v-model="typeData.code" placeholder="Nhập mã danh mục" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button color="#626aef" plain @click="handleClose">Đóng</el-button>
        <el-button color="#626aef" @click="handleSubmit(formInstance)">{{ typeTitle.button }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
