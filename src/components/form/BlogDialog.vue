<script setup lang="ts">
import { ref } from "vue"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import type { IBlog } from "@/utils/type"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { store } from "@/store"

const isVisible = ref(false)
const dialogRef = ref()
const blogData = ref<IBlog>({})
const blogTitle = ref({
  label: "",
  button: "",
})
const loading = ref(false)
const isImageEmpty = ref(false)
const editor = ClassicEditor
const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  title: [
    {
      required: true,
      message: "Tiêu đề không được để trống",
    },
  ],
  content: [
    {
      required: true,
      message: "Nội dung không được để trống",
    },
  ],
})
const openDialog = (data?: any) => {
  console.log(data)
  isVisible.value = true
  if (data) {
    blogData.value = { ...data }
    blogTitle.value = {
      label: "Chỉnh sửa thông tin bài viết",
      button: "Cập nhật",
    }
  } else {
    blogData.value = {}
    blogTitle.value = {
      label: "Thêm bài viết mới",
      button: "Lưu",
    }
  }
}

const selectedFiles = ref<any[]>()
const base64Images = ref<string>("")

const handleFileUpload = (event: any) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
  convertToBase64()
}

const convertToBase64 = () => {
  selectedFiles.value?.forEach((file: any) => {
    const reader = new FileReader()
    reader.onload = () => {
      base64Images.value = reader.result as string
      blogData.value.img = base64Images.value
      console.log(blogData.value)
    }
    reader.readAsDataURL(file)
  })
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

const onReady = (data: any) => {
  console.log("CKEditor is Ready!")
}

const onChange = (data: any) => {
  console.log(data)
}
const handleClose = () => {
  formRef.value?.resetFields()
  isVisible.value = false
}

const saveData = async () => {
  try {
    if (!blogData.value.img) {
      isImageEmpty.value = true
      return
    }
    loading.value = true
    isImageEmpty.value = false
    if (blogData.value.id) {
      // Update
      await store.dispatch("editBlog", {
        id: blogData.value.id,
        title: blogData.value.title,
        content: blogData.value.content,
        img: blogData.value.img,
      })
      await store.dispatch("getAllBlogs")
      ElMessage({
        type: "success",
        message: "Đã chỉnh sửa bài viết",
      })
    } else {
      // Create
      await store.dispatch("newBlog", {
        title: blogData.value.title,
        content: blogData.value.content,
        img: blogData.value.img,
      })
      await store.dispatch("getAllBlogs")
      ElMessage({
        type: "success",
        message: "Thêm mới bài viết thành công",
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
defineExpose({
  openDialog,
})
</script>
<template>
  <div class="blog-dialog" v-loading="loading">
    <el-dialog v-model="isVisible" ref="dialogRef" :before-close="handleClose">
      <template #header>
        <p>{{ blogTitle.label }}</p>
      </template>
      <div class="blog-dialog-content">
        <el-form ref="formRef" :rules="rules" :model="blogData" label-position="top">
          <el-form-item prop="title" label="Tiêu đề">
            <el-input v-model="blogData.title" placeholder="Nhập tên bài viết" />
          </el-form-item>
          <el-form-item prop="content" label="Nội dung">
            <div class="blog-ckeditor-form">
              <ckeditor :editor="editor" v-model="blogData.content" @ready="onReady" @input="onChange"></ckeditor>
            </div>
          </el-form-item>
          <el-form-item label="Hình ảnh">
            <div>
              <input type="file" @change="handleFileUpload" class="blog-panel-upload" />
              <img v-if="blogData.img" :src="blogData.img" width="100" alt="" />
              <div v-if="isImageEmpty" class="error-text">Bài viết cần có hình ảnh</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button color="#626aef" plain @click="handleClose">Đóng</el-button>
        <el-button color="#626aef" @click="handleSubmit(formRef)">{{ blogTitle.button }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.blog-ckeditor-form {
  width: 100%;
  .ck-content {
    min-height: 120px;
  }
}
</style>
