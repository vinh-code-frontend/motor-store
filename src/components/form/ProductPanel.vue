<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { store } from "@/store"
import type { IMotor } from "@/utils/type"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { helper } from "@/utils/utils"

const isVisible = ref(false)
const loading = ref(false)
const motorData = ref<IMotor>({})
const drawerTitle = ref({
  label: "",
  button: "",
})
const drawerRef = ref()
const getAllTypes = computed(() => store.state.types)
const images = ref<string[]>()
const isImageEmpty = ref(false)
const selectedFiles = ref<any[]>([])
const base64Images = ref<string[]>([])
const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: "Tên không được để trống",
    },
  ],
  type: [
    {
      required: true,
      message: "Loại không được để trống",
    },
  ],
  price: [
    {
      required: true,
      message: "Giá không được để trống",
    },
    {
      pattern: /^[0-9]+$/,
      message: "Giá phải là một số",
    },
  ],
  salePrice: [
    {
      pattern: /^[0-9]+$/,
      message: "Giá phải là một số",
    },
  ],
  famous: [
    {
      required: true,
      message: "Trường này không được để trống",
    },
  ],
})

const editor = ClassicEditor

const openDrawer = (data?: any) => {
  isVisible.value = true
  if (data) {
    motorData.value = { ...data }
    drawerTitle.value = {
      label: "Chỉnh sửa thông tin motor",
      button: "Cập nhật",
    }
    images.value = motorData.value.image
  } else {
    motorData.value = {}
    drawerTitle.value = {
      label: "Thêm motor mới",
      button: "Lưu",
    }
    images.value = undefined
  }
  selectedFiles.value = []
  base64Images.value = []
}

const onReady = (data: any) => {
  console.log("CKEditor is Ready!")
}

const onChange = (data: any) => {
  console.log(motorData.value.description)
}

const handleCancel = () => {
  formRef.value?.resetFields()
  isVisible.value = false
}

const handleSubmit = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      saveData()
    } else {
      console.log("error submit!")
      return false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
}

const saveData = async () => {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append("Name", motorData.value.name as string | Blob)
    formData.append("Type", motorData.value.type as string | Blob)
    formData.append("Description", motorData.value.description as string | Blob)
    formData.append("Price", motorData.value.price as string | Blob)
    formData.append("Farmous", motorData.value.famous as any)
    formData.append("SalePrice", motorData.value.salePrice as any)
    if (!motorData.value.image || motorData.value.image.length === 0) {
      // formData.append(`ImgMotor[0]`, "")
      console.log("need to have image")
      isImageEmpty.value = true
      loading.value = false
      return
    } else {
      isImageEmpty.value = false
      for (let i = 0; i < motorData.value.image.length; i++) {
        formData.append(`ImgMotor[${i}]`, motorData.value.image[i])
      }
    }
    if (motorData.value.id) {
      // Update
      formData.append("Id", motorData.value.id as string | Blob)
      formData.append("Status", "0" as string | Blob)
      await store.dispatch("editMotor", formData)
      await store.dispatch("getAllMotors")
      ElMessage({
        type: "success",
        message: "Edit motor thành công!",
      })
    } else {
      // Create
      await store.dispatch("newMotor", formData)
      await store.dispatch("getAllMotors")
      ElMessage({
        type: "success",
        message: "Thêm motor thành công!",
      })
    }
    isVisible.value = false
    loading.value = false
  } catch (error) {
    loading.value = false
    ElMessage({
      type: "error",
      message: "Lỗi bất định",
    })
  }
}

const handleFileUpload = (event: any) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
  convertToBase64()
}

const convertToBase64 = () => {
  base64Images.value = []
  selectedFiles.value.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      base64Images.value.push(reader.result as string)
      motorData.value.image = base64Images.value
    }
    reader.readAsDataURL(file)
  })
}

watch(
  () => selectedFiles.value,
  () => {
    console.log(selectedFiles.value)
  }
)

defineExpose({
  openDrawer,
})
</script>
<template>
  <div>
    <el-drawer
      ref="drawerRef"
      v-model="isVisible"
      class="order-drawer"
      :before-close="handleCancel"
      style="min-width: 580px"
    >
      <template #header>
        <h3 class="primary-color">{{ drawerTitle.label }}</h3>
      </template>
      <el-form
        ref="formRef"
        :model="motorData"
        v-loading="loading"
        label-position="top"
        require-asterisk-position="right"
        :rules="rules"
      >
        <el-form-item prop="name" label="Tên motor">
          <el-input v-model="motorData.name" placeholder="Nhập vào tên motor" />
        </el-form-item>
        <div style="display: flex; gap: 16px">
          <el-form-item prop="type" label="Danh mục">
            <el-select v-model="motorData.type" placeholder="Danh mục">
              <el-option v-for="item in getAllTypes" :key="item.id" :value="item.name!" :label="item.name">
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item prop="price" label="Giá gốc" required>
          <el-input v-model="motorData.price" placeholder="Nhập vào giá motor" />
        </el-form-item>
        <el-form-item prop="salePrice" label="Giá sau khi giảm">
          <el-input v-model="motorData.salePrice" placeholder="Nhập vào giá sau khi giảm" />
        </el-form-item>
        <el-form-item prop="famous" label="Nổi bật">
          <el-select v-model="motorData.famous" placeholder="Loại sản phẩm">
            <el-option :value="1" label="Sản phẩm nổi bật"> </el-option>
            <el-option :value="0" label="Sản phẩm bình thường"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Miêu tả">
          <div class="product-panel-ckeditor">
            <ckeditor :editor="editor" v-model="motorData.description" @ready="onReady" @input="onChange"></ckeditor>
          </div>
        </el-form-item>
        <el-form-item label="Hình ảnh">
          <div>
            <div v-if="images && !base64Images.length" style="display: flex; flex-wrap: wrap; gap: 8px">
              <div v-for="(image, index) in images" :key="index">
                <img :src="image" style="width: 120px; height: 80px; object-fit: cover" />
              </div>
            </div>
            <div v-if="base64Images.length" style="display: flex; flex-wrap: wrap; gap: 8px">
              <div v-for="(image, index) in base64Images" :key="index">
                <img :src="image" style="width: 120px; height: 80px; object-fit: cover" />
              </div>
            </div>
            <div><input type="file" multiple @change="handleFileUpload" class="product-panel-upload" /></div>
            <div v-if="isImageEmpty" class="error-text">Sản phẩm cần có hình ảnh</div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button color="#626aef" plain @click="resetForm">Reset</el-button>
        <el-button color="#626aef" plain @click="handleCancel">Đóng</el-button>
        <el-button color="#626aef" @click="handleSubmit(formRef)">{{ drawerTitle.button }}</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss">
.product-panel-ckeditor {
  width: 100%;

  .ck-content {
    min-height: 120px;
  }
}
</style>
